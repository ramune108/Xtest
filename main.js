// --- 1. Supabase設定 ---
const SUPABASE_URL = 'https://jziiuyezguukewkfpudw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KWKB8rprJAhTqQz9PoNscg_NowmknXH';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. 投票共通処理 ---
async function handleVote(id, type, element) {
    if (!_supabase) return;
    const column = type === 'good' ? 'good_count' : 'bad_count';
    const { error } = await _supabase.rpc('increment_vote', { row_id: id, col_name: column });
    if (!error) {
        // ボタンを押した時のエフェクト
        $(element).find('i').addClass('voted-icon');
        $(element).css('pointer-events', 'none');
        alert("Voted!");
    }
}

// --- 3. HTMLエスケープ関数 (XSS対策) ---
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m];
    });
}

// --- 4. ページ読み込み時の初期化 (各ページで必要に応じて呼び出す) ---
$(document).ready(function() {
    // ページごとの個別の処理は各HTMLの <script> に書くか、
    // ここで URL を判定して処理を分けることができます
});
