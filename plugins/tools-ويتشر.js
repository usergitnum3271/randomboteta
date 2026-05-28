import axios from "axios"
import cheerio from "cheerio"
import baileys from "@whiskeysockets/baileys"
import { pipeline } from "stream/promises"
const {
    generateWAMessageFromContent,
    prepareWAMessageMedia,
} = baileys;
import fs from "fs-extra"
import path from "path"
const DEFAULT_IMAGE = "https://files.catbox.moe/izt26a.jpg";
const footer = "𝑨𝑵𝑰𝑴𝑬";
const CONFIG_PATH = path.join(process.cwd(), "lib", "gintoki.json");
if (!fs.existsSync(path.dirname(CONFIG_PATH))) {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
}
if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({}, null, 2));
}
if (!fs.existsSync(path.join(process.cwd(), "tmp"))) {
    fs.mkdirSync(path.dirname(path.join(process.cwd(), "tmp")), { recursive: true });
}
const AnimeWitcher = {
    config: {
        projectId: "animewitcher-1c66d",
        firebaseApiKey: "AIzaSyAcbWRwfFNnCpoydDXlEALWnM_TYVcJOMU",
        get refreshToken() {
            try {
                if (!fs.existsSync(CONFIG_PATH)) return null;
                const data = fs.readFileSync(CONFIG_PATH, "utf-8");
                const json = JSON.parse(data);
                return json.refreshToken || null;
            } catch (e) {
                console.error("Failed to read refreshToken:", e.message);
                return null;
            }
        },
        set refreshToken(value) {
            try {
                let json = {};
                if (fs.existsSync(CONFIG_PATH)) {
                    json = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
                }
                json.refreshToken = value;
                fs.writeFileSync(CONFIG_PATH, JSON.stringify(json, null, 2));
            } catch (e) {
                console.error("Failed to update refreshToken:", e.message);
            }
        },
        algolia: {
            appId: "RV1NI0FQC6",
            apiKey: "9cefebad731e1547e2f2384094a17869",
            base: "https://rv1ni0fqc6-dsn.algolia.net/1/indexes"
        }
    },
    stripHtml: function (html) {
        return html.replace(/<[^>]*>/g, "");
    },
    algoliaSearch: async (
        query = "",
        index = "series",
        page = 0,
        hitsPerPage = 10,
        attributes = [
            "objectID", "name", "tags", "poster_uri", "poster",
            "order", "path", "type", "details"
        ]
    ) => {
        const url = `${AnimeWitcher.config.algolia.base}/${index}/query`;
        const body = {
            params: `query=${encodeURIComponent(query)}` +
                `&page=${page}` +
                `&hitsPerPage=${hitsPerPage}` +
                `&attributesToRetrieve=${encodeURIComponent(JSON.stringify(attributes))}`
        };
        const { data } = await axios.post(url, body, {
            headers: {
                "X-Algolia-Application-Id": AnimeWitcher.config.algolia.appId,
                "X-Algolia-API-Key": AnimeWitcher.config.algolia.apiKey,
                "Content-Type": "application/json"
            }
        });
        return {
            hits: data.hits,
            nbHits: data.nbHits || 0,
            page: data.page || 0,
            nbPages: data.nbPages || 0
        };
    },
    auth: {
        async getIdToken() {
            if (AnimeWitcher.config.refreshToken) {
                try {
                    const { data } = await axios.post(
                        `https://securetoken.googleapis.com/v1/token?key=${AnimeWitcher.config.firebaseApiKey}`,
                        new URLSearchParams({
                            grant_type: "refresh_token",
                            refresh_token: AnimeWitcher.config.refreshToken
                        }).toString(),
                        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
                    );
                    return data.access_token;
                } catch { /* nothing */ }
            }
            const email = `temp_${Date.now()}@example.com`;
            const password = "12345678910";
            const { data } = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${AnimeWitcher.config.firebaseApiKey}`,
                { email, password, returnSecureToken: true }
            );
            AnimeWitcher.config.refreshToken = data.refreshToken;
            return data.idToken;
        }
    },
    firestore: {
        get baseUrl() {
            return `https://firestore.googleapis.com/v1/projects/${AnimeWitcher.config.projectId}/databases/(default)/documents`;
        },
        fetch: async (idToken, path) => {
            let allDocs = [], pageToken = null;
            do {
                let url = `${AnimeWitcher.firestore.baseUrl}/${path}`;
                if (pageToken) url += `?pageToken=${pageToken}`;
                const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${idToken}` } });
                if (data.fields) {
                    allDocs.push(AnimeWitcher.firestore.extract(data.fields));
                } else if (Array.isArray(data.documents)) {
                    allDocs.push(...data.documents.map(doc => AnimeWitcher.firestore.extract(doc.fields)));
                }
                pageToken = data.nextPageToken;
            } while (pageToken);
            return allDocs;
        },
        extract(fields) {
            const out = {};
            for (const k in fields) {
                const v = fields[k];
                if (v.stringValue !== undefined) out[k] = v.stringValue;
                else if (v.integerValue !== undefined) out[k] = Number(v.integerValue);
                else if (v.doubleValue !== undefined) out[k] = v.doubleValue;
                else if (v.booleanValue !== undefined) out[k] = v.booleanValue;
                else if (v.nullValue !== undefined) out[k] = null;
                else if (v.mapValue) out[k] = AnimeWitcher.firestore.extract(v.mapValue.fields);
                else if (v.arrayValue) out[k] = (v.arrayValue.values || []).map(x => AnimeWitcher.firestore.extract({ x }).x);
            }
            return out;
        }
    },
    anime: {
        episodes: async (idToken, animeName) => {
            const data = await AnimeWitcher.firestore.fetch(idToken, `anime_list/${animeName}/episodes`);
            return Array.isArray(data) ? data : (data && typeof data === "object" ? [data] : []);
        },
        servers: async (idToken, animeName, episodeId, usedPrefix, media) => {
            const raw = await AnimeWitcher.firestore.fetch(idToken, `anime_list/${animeName}/episodes/${episodeId}/servers`);
            const groupedServers = (Array.isArray(raw) ? raw : [])
                .filter(s => s.name && s.link && s.quality)
                .reduce((acc, s) => {
                    if (!acc[s.quality]) acc[s.quality] = [];
                    acc[s.quality].push(s);
                    return acc;
                }, {});

            const list = Object.entries(groupedServers)
                .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
                .map(([quality, servers]) => ({
                    title: `「 ${quality} 」`,
                    highlight_label: footer,
                    rows: servers.map(s => ({
                        header: "سيرفر: " + s.name,
                        title: "الجودة: " + s.quality + " (" + s.name + ")",
                        description: "بواسطة: " + footer,
                        id: `${usedPrefix}witcher-watch ${JSON.stringify({
                            id: "select-server-fallback",
                            data: {
                                selectedServer: { ...s, media },
                                allServers: groupedServers
                            }
                        }, null, 0)}`
                    }))
                }));
            return { list, data: groupedServers };
        }
    },
    files: {
        mediafire: async url => {
            if (!url || !/mediafire\.com/i.test(url)) return null;
            const { data: html } = await axios.get(url);
            const match = html.match(/https:\/\/download\d+\.mediafire\.com\/[^'"]+/);
            return match ? match[0] : null;
        },
        streamtape: async url => {
            const { data } = await axios.get(url.replace("/e/", "/v/"), {
                headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Mobile Safari/537.36" }
            });
            const norobotMatch = /document\.getElementById\('norobotlink'\)\.innerHTML\s*=\s*(.+?);/.exec(data);
            if (!norobotMatch?.[1]) throw new Error("No norobotlink");
            const tokenMatch = /token=([^&'"]+)/.exec(norobotMatch[1]);
            if (!tokenMatch?.[1]) throw new Error("No token");
            const videoPath = cheerio.load(data)("#ideoooolink").text().trim();
            if (!videoPath) throw new Error("No video link");
            return `https:/${videoPath}&token=${tokenMatch[1]}&dl=1`;
        },
        pixeldrain: url => {
            if (!url || !url.startsWith("https://pixeldrain.com/u/")) return null;
            const id = url.split("/u/")[1];
            return id ? `https://pixeldrain.com/api/file/${id}` : null;
        },
        check: async url => {
            try {
                const headResponse = await axios.head(url);
                const fileSize = parseInt(headResponse.headers["content-length"], 10);
                return !isNaN(fileSize) && fileSize <= 1024 * 1024 * 1024;
            } catch (error) {
                console.error(`AnimeWitcher.files.check: Error checking URL ${url}:`, error.message);
                return false;
            }
        }
    }
};

function getRandomItems(arr, count = 10) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
}

async function sendInteractiveMessage(gintoki, m, message) {
    const msg = await generateWAMessageFromContent(m.chat, { viewOnceMessage: { message } }, { userJid: gintoki.user.jid, quoted: m });
    return gintoki.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}

async function sendList(gintoki, m, text, media, title, sections) {
    const mediaMessage = media ? await prepareWAMessageMedia({ image: { url: media } }, { upload: gintoki.waUploadToServer }) : null;
    return sendInteractiveMessage(gintoki, m, {
        interactiveMessage: {
            body: { text },
            footer: { text: footer },
            header: mediaMessage ? { hasMediaAttachment: true, imageMessage: mediaMessage.imageMessage } : { hasMediaAttachment: false },
            nativeFlowMessage: {
                buttons: [{
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({ title, sections })
                }]
            }
        }
    });
}

async function sendUrlButton(gintoki, m, text, media, name, url) {
    const mediaMessage = media ? await prepareWAMessageMedia({ image: { url: media } }, { upload: gintoki.waUploadToServer }) : null;
    return sendInteractiveMessage(gintoki, m, {
        interactiveMessage: {
            body: { text },
            footer: { text: footer },
            header: mediaMessage ? { hasMediaAttachment: true, imageMessage: mediaMessage.imageMessage } : { hasMediaAttachment: false },
            nativeFlowMessage: {
                buttons: [{
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({ display_text: name, url, merchant_url: url })
                }]
            }
        }
    });
}

async function sendMultipleUrlButtons(gintoki, m, text, media, buttons) {
    const mediaMessage = media ? await prepareWAMessageMedia({ image: { url: media } }, { upload: gintoki.waUploadToServer }) : null;
    const nativeButtons = buttons.map(btn => ({
        name: "cta_url",
        buttonParamsJson: JSON.stringify({ display_text: btn.name, url: btn.url, merchant_url: btn.url })
    }));
    return sendInteractiveMessage(gintoki, m, {
        interactiveMessage: {
            body: { text },
            footer: { text: footer },
            header: mediaMessage ? { hasMediaAttachment: true, imageMessage: mediaMessage.imageMessage } : { hasMediaAttachment: false },
            nativeFlowMessage: { buttons: nativeButtons }
        }
    });
}

const TEXTS = {
    errors: {
        invalidJson: "⚠️ البيانات المدخلة غير صالحة، يجب أن تكون بصيغة JSON.",
        incompleteData: "❌ البيانات غير مكتملة.",
        authFailed: "❌ فشل التحقق من المصادقة.",
        noEpisodes: "😕 لا توجد حلقات متاحة لهذا الأنمي حاليًا.",
        noServers: "🤷‍♂️ لم يتم العثور على سيرفرات لهذه الحلقة.",
        allServersFailed: "❌ عذرًا، فشلت جميع السيرفرات المتاحة لهذه الحلقة.",
        unsupportedFallback: "⚠️ فشلت كل السيرفرات المدعومة. يمكنك تجربة هذه الروابط يدويًا:",
        unsupportedServer: "🤔 هذا السيرفر غير مدعوم للمعالجة التلقائية، لكن يمكنك محاولة فتحه مباشرة.",
        default: (err, stack) => `❌ حدث خطأ غير متوقع.\n\n*الخطأ:*\n${err}\n\n*المصدر:*\n${stack}`
    },
    welcome: "👋 أهلًا بك في *أنمي ويتشر*!\n\nيمكنك البحث عن أنمي أو الاختيار من القوائم المقترحة أدناه.",
    searching: (query) => `🔎 جاري البحث عن *"${query}"*...`,
    noResults: "😕 لم يتم العثور على نتائج بحث تطابق طلبك.",
    searchResults: (text) => `📖 *نتائج البحث عن:* ${text}\n\nاختر أنميًا من القائمة للمتابعة:`,
    serverList: "أهلاً، إليك قائمة السيرفرات المتوفرة:",
    tryingServer: (name, quality) => `⏳ جاري تجربة سيرفر *${name}* بجودة *${quality}*...`,
    largeVideo: "⚠️ حجم الفيديو كبير جدًا لإرساله مباشرةً. سأرسل لك الرابط لمشاهدته أو تحميله.",
    watchEpisode: "مشاهدة الحلقة"
};

let handler = async (m, props) => {
    const { command, conn: gintoki } = props;
    const chatId = m.chat;
    const gintokireply = (q) =>  m.reply(q)
    if (!gintoki.user.jid && gintoki.user.id) gintoki.user.jid = gintoki.decodeJid(gintoki.user.id);
    if (!props.m) props.m = m;
    props.gintokireply = gintokireply
    props.usedPrefix = (props.usedPrefix || props.prefix || '.')
    props.chatId = m.chat
    props.gintoki = gintoki;
    try {
        await gintoki.sendMessage(chatId, { react: { text: "⏳", key: m.key } });
        const commandMap = {
            "witcher": handleWitcherCommand, "ويتشر": handleWitcherCommand,
            "witcher-select": handleSelectCommand,
            "witcher-watch": handleWatchCommand
        };
        if (commandMap[command]) await commandMap[command](props);
        await gintoki.sendMessage(chatId, { react: { text: "✅", key: m.key } });
    } catch (err) {
        console.error("handler error:", err?.message || err, err.stack);
        await gintoki.sendMessage(chatId, { react: { text: "❌", key: m.key } });
        const stackLine = err.stack?.split("\n")[1]?.trim() || "";
        await gintokireply(TEXTS.errors.default(err.toString(), stackLine));
    }
};

async function handleWitcherCommand({ gintoki, m, text, usedPrefix, gintokireply }) {
    if (!text) {
        const [res1, res2] = await Promise.all([
            AnimeWitcher.algoliaSearch("", "most_watched_animations"),
            AnimeWitcher.algoliaSearch("", "best_mal_ranked")
        ]);
        const toRows = (hits, id) => getRandomItems(hits).map(item => ({
            header: `⭐ ${item.name} (${item.type})`,
            title: item.details.eps_num || (item.type === "فيلم" ? "فيلم" : item.details.state),
            description: item.tags.join("، "),
            id: `${usedPrefix}witcher-select ${JSON.stringify({ id, data: item }, null, 2)}`
        }));
        await sendList(gintoki, m, TEXTS.welcome, DEFAULT_IMAGE, "「 تصفح الخيارات 」", [
            { title: "🌟 أنميات قد تعجبك", highlight_label: footer, rows: toRows(res1.hits, "most") },
            { title: "🏆 أفضل الأنميات عالميا", highlight_label: footer, rows: toRows(res2.hits, "best") }
        ]);
    } else {
        await gintokireply(TEXTS.searching(text));
        const { hits } = await AnimeWitcher.algoliaSearch(text, "series");
        if (!hits || hits.length === 0) return gintokireply(TEXTS.noResults);

        const rows = hits.slice(0, 20).map(item => ({
            header: `🎬 ${item.name} (${item.type})`,
            title: item.details.eps_num || (item.type === "فيلم" ? "فيلم" : item.details.state),
            description: item.tags.join("، "),
            id: `${usedPrefix}witcher-select ${JSON.stringify({ id: "search", data: item }, null, 2)}`
        }));
        const thumb = hits.find(r => r.poster_uri)?.poster_uri || DEFAULT_IMAGE;
        await sendList(gintoki, m, TEXTS.searchResults(text), thumb, "「 قــائــمــة الأنمي 」", [{ title: "🔍 نتائج البحث", highlight_label: footer, rows }]);
    }
}

async function handleSelectCommand({ gintoki, m, text, usedPrefix, gintokireply }) {
    const json = isJsonLikeString(text);
    if (!json) return gintokireply(TEXTS.errors.invalidJson);
    const { id: task, data } = json;
    if (!task || !data) return gintokireply(TEXTS.errors.incompleteData);

    const idToken = await AnimeWitcher.auth.getIdToken();
    if (!idToken) return gintokireply(TEXTS.errors.authFailed);

    const episodesList = await AnimeWitcher.anime.episodes(idToken, data.name);
    if (!episodesList.length) return gintokireply(TEXTS.errors.noEpisodes);

    const caption = buildAnimeCaption(task, data);
    const rows = episodesList.map(ep => ({
        header: `👁️ ${ep.views ?? 0}`, title: ep.name || "حلقة", description: `⏳ ${ep.duration ?? "24د"}`,
        id: `${usedPrefix}witcher-watch ${JSON.stringify({ id: "servers", data: { ...ep, anime: data.name } })}`
    }));
    const thumb = data.poster_uri || data.poster?.medium || DEFAULT_IMAGE;
    await sendList(gintoki, m, caption, thumb, "「 قائمة الحلقات 」", [{ title: "📺 حلقات الأنمي", highlight_label: footer, rows }]);
}

async function handleWatchCommand({ gintoki, m, text, usedPrefix, gintokireply, chatId }) {
    const json = isJsonLikeString(text);
    if (!json) return gintokireply(TEXTS.errors.invalidJson);
    const { id: task, data } = json;
    if (!task || !data) return gintokireply(TEXTS.errors.incompleteData);

    const idToken = await AnimeWitcher.auth.getIdToken();
    if (!idToken) return gintokireply(TEXTS.errors.authFailed);

    if (task === "servers") {
        const { list } = await AnimeWitcher.anime.servers(idToken, data.anime, data.doc_id, usedPrefix, data.thumb_uri);
        if (!list || !list.length) return gintokireply(TEXTS.errors.noServers);
        const thumb = (await validateThumb(data.thumb_uri)) || DEFAULT_IMAGE;
        await sendList(gintoki, m, TEXTS.serverList, thumb, "「 تصفح السيرفرات 」", list);

    } else if (task === "select-server-fallback") {
        const { selectedServer, allServers } = data;
        const supportedServerNames = ["MF", "MF2", "PD", "ST"];

        // Pre-check: If the initially selected server is unsupported, send its link directly and stop.
        if (!supportedServerNames.includes(selectedServer.name)) {
            await gintokireply(TEXTS.errors.unsupportedServer);
            await sendUrlButton(gintoki, m, `▶️ اضغط لمشاهدة الفيديو من السيرفر غير المدعوم`, (await validateThumb(selectedServer.media)) || DEFAULT_IMAGE, `فتح ${selectedServer.name}`, selectedServer.link);
            return;
        }

        const serverQueue = createServerQueue(selectedServer, allServers);
        const unsupportedServers = [];

        for (const server of serverQueue) {
            if (!supportedServerNames.includes(server.name)) {
                unsupportedServers.push(server);
                continue;
            }
            await gintokireply(TEXTS.tryingServer(server.name, server.quality));
            try {
                let videoUrl;
                switch (server.name) {
                    case "MF": case "MF2": videoUrl = await AnimeWitcher.files.mediafire(server.link); break;
                    case "PD": videoUrl = await AnimeWitcher.files.pixeldrain(server.link); break;
                    case "ST": videoUrl = await AnimeWitcher.files.streamtape(server.link); break;
                }
                if (!videoUrl || !/^https?:\/\//i.test(videoUrl)) {
                    console.error(`Invalid URL for server ${server.name}: ${videoUrl}`);
                    continue;
                }

                const canSendDirectly = await AnimeWitcher.files.check(videoUrl);
                if (canSendDirectly) {
                    try {
                        const tempFilePath = path.join(process.cwd(), "tmp", `anime_${Date.now()}.mp4`);
                        const response = await axios.get(videoUrl, { responseType: 'stream' });
                        await pipeline(response.data, fs.createWriteStream(tempFilePath));
                        const disposition = response.headers['content-disposition'];
                        const fileName = disposition?.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i)?.[1] || 'video.mp4';
                        await gintoki.sendMessage(chatId, {
                            document: fs.readFileSync(tempFilePath),
                            fileName: decodeURIComponent(fileName),
                            mimetype: response.headers['content-type']?.split(";")[0] || "video/mp4"
                        }, { quoted: m });
                        fs.unlinkSync(tempFilePath);
                        return; // SUCCESS: Sent directly, exit the entire handleWatchCommand
                    } catch (directSendError) {
                        console.error(`Error sending video directly from ${server.name}:`, directSendError);
                        continue; // Direct send failed, so continue to the next server in the queue
                    }
                } else {
                    // Video is too large, send URL button and return (success in providing link)
                    await gintokireply(TEXTS.largeVideo);
                    await sendUrlButton(gintoki, m, `▶️ اضغط لمشاهدة الفيديو`, server.media || DEFAULT_IMAGE, TEXTS.watchEpisode, videoUrl);
                    return; // SUCCESS: Sent URL for large video, exit the entire handleWatchCommand
                }

            } catch (e) {
                console.error(`Error processing server ${server.name} [${server.link}]:`, e.message);
                continue; // Go to next server in queue
            }
        }

        // If we reach here, all supported servers failed to provide a direct video or a large video URL.
        if (unsupportedServers.length > 0) {
            const buttons = unsupportedServers.map(s => ({ name: `${s.name} - ${s.quality}`, url: s.link }));
            await sendMultipleUrlButtons(gintoki, m, TEXTS.errors.unsupportedFallback, selectedServer.media || DEFAULT_IMAGE, buttons);
        } else {
            await gintokireply(TEXTS.errors.allServersFailed);
        }
    }
}

function createServerQueue(selected, all) {
    const queue = [selected];
    const addedLinks = new Set([selected.link]);
    const allQualities = Object.keys(all).sort((a, b) => parseInt(b) - parseInt(a));
    const selectedQuality = selected.quality;

    if (all[selectedQuality]) {
        for (const server of all[selectedQuality]) {
            if (!addedLinks.has(server.link)) {
                queue.push(server);
                addedLinks.add(server.link);
            }
        }
    }

    for (const quality of allQualities) {
        if (quality === selectedQuality) continue;
        for (const server of all[quality]) {
            if (!addedLinks.has(server.link)) {
                queue.push(server);
                addedLinks.add(server.link);
            }
        }
    }
    return queue;
}

function buildAnimeCaption(task, data) {
    const details = data.details || {};
    const getStat = (value, unit = '') => (Number.isFinite(value) ? `${value}${unit}` : "-");
    const baseInfo = [
        `🎬 *${data.name || "غير معروف"}*`, `---`,
        `📌 *العنوان الإنجليزي:* ${details.english_title || "-"}`,
        `🗂️ *النوع:* ${data.type || "-"}`, `🎞️ *الحالة:* ${details.state || "-"}`,
        `🎯 *التصنيف العمري:* ${details.age || "-"}`, `📅 *الموسم:* ${details.season || "-"}`,
        `📆 *سنة الإنتاج:* ${details.year || "-"}`, `📺 *عدد الحلقات:* ${getStat(details.eps_num)}`,
        `🏭 *الاستوديو:* ${Array.isArray(details.studio) ? details.studio.join(", ") : "-"}`
    ].join("\n");

    let extra = "";
    const story = AnimeWitcher.stripHtml(data?._highlightResult?.story?.value || "لا توجد قصة متاحة.");
    const tags = Array.isArray(data.tags) && data.tags.length ? data.tags.join("، ") : "-";

    if (["search", "best"].includes(task)) {
        extra = [
            `---`,
            `⭐ *تقييم MAL:* ${getStat(details.mal_mean)} (${getStat(details.mal_num_scoring_users, ' مستخدم')})`,
            `🌟 *التقييم العام:* ${getStat(data.average_rate, ' / 10')}`,
            `🏷️ *التصنيفات:* ${tags}`, `---`, `📝 *القصة:*\n${story}`
        ].join("\n");
    } else if (task === "most") {
        extra = [`---`, `🏷️ *التصنيفات:* ${tags}`, `---`, `📝 *القصة:*\n${story}`].join("\n");
    }
    return `${baseInfo}\n${extra}`.trim();
}

handler.command = ["witcher", "ويتشر", "witcher-select", "witcher-watch"];
handler.category = "السكراب";
handler
export default handler;

function isJsonLikeString(str) {
    if (typeof str !== "string") return false;
    const s = str.trim();
    if (!s) return false;
    if ((s.startsWith("{") && s.endsWith("}")) || (s.startsWith("[") && s.endsWith("]"))) {
        try {
            const parsed = JSON.parse(s);
            return typeof parsed === "object" && parsed !== null ? parsed : false;
        } catch { return false; }
    }
    return false;
}

async function validateThumb(url) {
    if (!url) return false;
    try {
        const res = await axios.head(url);
        return res.status === 200 ? url : false;
    } catch { return false; }
}