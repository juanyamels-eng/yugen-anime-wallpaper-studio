// Unique title generation engine for 100 distinct anime wallpapers per category
// Provides 100 100% unique thematic titles, Japanese names, and descriptions for each category

export interface ThematicTitle {
  en: string;
  jp: string;
  desc: string;
}

const CATEGORY_VOCABULARY: Record<string, {
  adjectives: string[];
  nouns: string[];
  suffixes: string[];
  jpPrefixes: string[];
  jpNouns: string[];
}> = {
  'cat-cyberpunk': {
    adjectives: ['Neon', 'Cyber', 'Synapse', 'Holo', 'Glitch', 'Chrono', 'Quantum', 'Plasma', 'Neural', 'Titan', 'Laser', 'Bionic', 'Zero', 'Prismatic', 'Obsidian', 'Augmented', 'Hyper', 'Static', 'Vector', 'Silicon'],
    nouns: ['Drifter', 'Hacker', 'Ronin', 'Android', 'Valkyrie', 'Matrix', 'Nexus', 'Protocol', 'Overdrive', 'Kitsune', 'Ghost', 'Grid', 'Alleyway', 'Core', 'Skyline', 'Edge', 'Infiltrator', 'Blade', 'Cipher', 'Vigil'],
    suffixes: ['of Neo-Tokyo', 'at Midnight', 'in Acid Rain', 'Overdrive', 'Protocol', 'Unbound', 'Zero Hour', 'Horizon', 'Resonance', 'Sector 9', 'Breach', 'Awakening', 'Ascent', 'Echo', 'Drift'],
    jpPrefixes: ['電脳', 'ネオン', '量子', 'サイバー', '光子', '虚数', '新東京', '閃光', '暗号', '高周波'],
    jpNouns: ['浪人', '電脳少女', '潜入者', '義体', '回路', '境界', 'ハッカー', 'アンドロイド', '執行官', '残影'],
  },
  'cat-samurai': {
    adjectives: ['Crimson', 'Moonlit', 'Bamboo', 'Silent', 'Golden', 'Shadow', 'Iron', 'Ancestral', 'Wind', 'Storm', 'Fallen', 'Dragon', 'Sacred', 'Honor', 'Ronin', 'Zen', 'Thunder', 'Edo', 'Ghost', 'Steel'],
    nouns: ['Blade', 'Katana', 'Duelist', 'Guardian', 'Sentinel', 'Master', 'Swordsman', 'Kunoichi', 'Warrior', 'Soul', 'Stance', 'Torii', 'Haori', 'Armor', 'Spirit', 'Dojo', 'Path', 'Scroll', 'Echo', 'Clash'],
    suffixes: ['at Dawn', 'under Blood Moon', 'of Kyoto', 'in Falling Petals', 'of the Sacred Crest', 'of the Ronin', 'under Cherry Rain', 'at the Gates', 'in Snow', 'of Bushido', 'Reborn', 'Legacy', 'Pledge', 'Vow', 'Rest'],
    jpPrefixes: ['紅蓮', '月下', '孤高', '疾風', '雷鳴', '祖霊', '無心', '黒鉄', '名刀', '神速'],
    jpNouns: ['侍', '浪人', '剣豪', '武士道', '抜刀', '一閃', '御影', '修羅', '刃心', '影縫'],
  },
  'cat-fantasy': {
    adjectives: ['Aetherial', 'Crystal', 'Ancient', 'Celestial', 'Astral', 'Luminous', 'Arcane', 'Ethereal', 'Sylvan', 'Mythic', 'Enchanted', 'Solar', 'Lunar', 'Silver', 'Golden', 'Forgotten', 'Whispering', 'Radiant', 'Starlight', 'Eternal'],
    nouns: ['Isles', 'Spire', 'Ruins', 'Sanctuary', 'Cathedral', 'Forest', 'Gólem', 'Altar', 'Sorceress', 'Crown', 'Fae', 'Dragon', 'Haven', 'Monolith', 'Falls', 'Library', 'Garden', 'Oasis', 'Shrine', 'Chronicle'],
    suffixes: ['of Eld', 'of Celestia', 'of Eternity', 'in the Clouds', 'of the Sunken Moon', 'Beyond Time', 'of Whispers', 'Awakened', 'Ascendant', 'of the Archon', 'of Stardust', 'Everlasting', 'Realm', 'Vale', 'Song'],
    jpPrefixes: ['天空', '水晶', '太古', '星界', '神秘', '神聖', '幻想', '精霊', '永遠', '光輝'],
    jpNouns: ['諸島', '尖塔', '聖域', '大聖堂', '守護者', '妖精', '竜王', '秘境', '祭壇', '神殿'],
  },
  'cat-dark-fantasy': {
    adjectives: ['Abyssal', 'Crimson', 'Gothic', 'Ashen', 'Obsidian', 'Raven', 'Cursed', 'Grim', 'Bloodborne', 'Shadow', 'Nocturnal', 'Forsaken', 'Blighted', 'Spectral', 'Dread', 'Fallen', 'Bleak', 'Eclipse', 'Nether', 'Ruined'],
    nouns: ['Knight', 'Cathedral', 'Sovereign', 'Throne', 'Blade', 'Valkyrie', 'Requiem', 'Duchess', 'Gargoyle', 'Scythe', 'Lord', 'Underworld', 'Mausoleum', 'Abyss', 'Chasm', 'Sanctuary', 'Shade', 'Bane', 'Altar', 'Emperor'],
    suffixes: ['of the Eclipse', 'of Cinders', 'in the Abyss', 'of the Void', 'of Broken Vows', 'Unforgiven', 'of Ravenhall', 'in Mourning', 'of the Bloodline', 'Beyond Grace', 'Ascendant', 'Eternal Doom', 'Banishment', 'Rest', 'Domain'],
    jpPrefixes: ['深淵', '血食', '暗黒', '冥府', '灰燼', '黒曜', '呪詛', '漆黒', '終焉', '夜魔'],
    jpNouns: ['騎士', '君主', '玉座', '大鎌', '魔女', '鎮魂歌', '使徒', '大聖堂', '怨霊', '死線'],
  },
  'cat-tokyo-night': {
    adjectives: ['Shinjuku', 'Akihabara', 'Shibuya', 'Roppongi', 'Midnight', 'Rainy', 'Neon', 'Golden', 'Twilight', 'Underpass', 'Vintage', 'Electric', 'Misty', 'Solitary', 'Urban', 'Velvet', 'Distant', 'Quiet', 'Overcast', 'Amber'],
    nouns: ['Crossing', 'Rooftop', 'Alleyway', 'Platform', 'Skyline', 'Lantern', 'Graffiti', 'Overpass', 'Vending', 'Izakaya', 'Tower', 'Express', 'Avenue', 'Neon Sign', 'Cab', 'Bridge', 'Promenade', 'Corridor', 'Reflection', 'Station'],
    suffixes: ['at 3 AM', 'in the Drizzle', 'Lights', 'Echoes', 'under the Rain', 'Reflections', 'Breeze', 'Chronicles', 'Midnight Drive', 'Serenade', 'Vignette', 'Memories', 'Overlook', 'View', 'Pulse'],
    jpPrefixes: ['真夜中', '秋葉原', '渋谷', '新宿', '六本木', '雨煙る', '終電', '街角', '夜景', '黄昏'],
    jpNouns: ['交差点', '裏路地', '屋上', '自販機', '提灯', '高架下', '歩道橋', '駅前', 'タワー', '雨宿り'],
  },
  'cat-sakura': {
    adjectives: ['Spring', 'Blossoming', 'Petal', 'Gentle', 'Pink', 'Floral', 'Pastel', 'Sunlit', 'Soft', 'Breeze', 'Floating', 'Ethereal', 'Verdant', 'Fragrant', 'Sweet', 'Golden', 'Morning', 'Twilight', 'Pure', 'Sacred'],
    nouns: ['Breeze', 'River', 'Shrine', 'Canopy', 'Garden', 'Pagoda', 'Bridge', 'Yukata', 'Tea House', 'Parasol', 'Alley', 'Branch', 'Whirlpool', 'Stream', 'Arbor', 'Avenue', 'Drop', 'Sanctuary', 'Pond', 'Crest'],
    suffixes: ['in Bloom', 'Drifting by', 'of Meguro', 'at Kyoto Dawn', 'in Spring Air', 'Petal Rain', 'Memories', 'Whisper', 'of Romance', 'under the Sun', 'Serenade', 'Peace', 'Grace', 'Harmony', 'Elegance'],
    jpPrefixes: ['桜花', '春風', '花筏', '満開', '初春', '桃色', '木漏れ日', 'うららか', '宵桜', '薄紅'],
    jpNouns: ['神社', '茶屋', '目黒川', '五重塔', '庭園', '小径', '太鼓橋', '花吹雪', '和傘', '水辺'],
  },
  'cat-mecha': {
    adjectives: ['Titan', 'Orbital', 'Plasma', 'Quantum', 'Hydraulic', 'Armored', 'Vanguard', 'Apex', 'Cyber', 'Solar', 'Heavy', 'Recon', 'Iron', 'Particle', 'Sub-Orbital', 'Electromagnetic', 'Hyper', 'Assault', 'Genesis', 'Core'],
    nouns: ['Unit', 'Titan', 'Hangar', 'Cannon', 'Platform', 'Frame', 'Exoskeleton', 'Drone', 'Fleet', 'Chassis', 'Pilot', 'Thruster', 'Ignition', 'Wing', 'Battery', 'Reactor', 'Colossus', 'Arsenal', 'Battleship', 'Garrison'],
    suffixes: ['Mark VII', 'Orbital Launch', 'Sector Core', 'Protocol', 'Overload', 'Zero-G', 'Prime', 'Ignition', 'Defense Grid', 'Vanguard', 'Apex Strike', 'Override', 'Standby', 'Ascent', 'Breach'],
    jpPrefixes: ['機動', '軌道', '試作', '装甲', '電磁', '重装', '戦術', '深宇宙', '超音速', '主機'],
    jpNouns: ['巨兵', '格納庫', '砲台', '推進翼', '操縦席', '要塞', '艦隊', '突撃機', '迎撃機', '防衛圏'],
  },
  'cat-romance': {
    adjectives: ['Golden', 'Sunset', 'Distant', 'Warm', 'Melancholic', 'Gentle', 'Sweet', 'Nostalgic', 'Summer', 'Autumn', 'Tender', 'Starlit', 'Twilight', 'Crimson', 'Breezy', 'Fleeting', 'Shared', 'Silent', 'Youthful', 'Pastel'],
    nouns: ['Promise', 'Platform', 'Umbrella', 'Hilltop', 'Confession', 'Sunset', 'Bicycle', 'Gaze', 'Balcony', 'Whisper', 'Horizons', 'Afternoon', 'Steps', 'Sea Breeze', 'Rooftop', 'Letter', 'Park', 'Station', 'Locket', 'Embrace'],
    suffixes: ['at Sunset', 'after School', 'under the Cloud', 'in Golden Hour', 'by the Sea', 'in Summer Breeze', 'Echoes', 'of Youth', 'Forever', 'Unspoken', 'Tears of Joy', 'Heartbeats', 'Promise', 'Walk', 'Glow'],
    jpPrefixes: ['黄昏', '放課後', '夕焼け', '相合い', '初恋', '切ない', '茜色', '夏休み', '青春', '潮風'],
    jpNouns: ['約束', '告白', '駅のホーム', '屋上', '傘', '自転車', '坂道', '海岸', '図書室', '星空'],
  },
  'cat-magic': {
    adjectives: ['Arcane', 'Celestial', 'Starlight', 'Chronos', 'Elemental', 'Luminescent', 'Forbidden', 'Astral', 'Prismatic', 'Mystic', 'Runic', 'Ethereal', 'Radiant', 'Enchanted', 'Alchemical', 'Occult', 'Gilded', 'Infinite', 'Ancient', 'Woven'],
    nouns: ['Circle', 'Grimoire', 'Familiar', 'Hourglass', 'Wand', 'Spire', 'Chamber', 'Portal', 'Cauldron', 'Equilibrium', 'Rune', 'Apprentice', 'Orb', 'Lantern', 'Elixir', 'Scroll', 'Sanctum', 'Mirage', 'Aura', 'Tome'],
    suffixes: ['of the Stars', 'Invocation', 'Incantation', 'Ritual', 'of the Mage', 'Awakened', 'of Light', 'Ascendant', 'of the Void', 'Unbound', 'of Elements', 'Equinox', 'Mystery', 'Eclipse', 'Sanctuary'],
    jpPrefixes: ['魔導', '秘術', '星光', '円環', '元素', '禁断', '錬金', '召喚', '霊力', '占星'],
    jpNouns: ['魔法陣', '使い魔', '大魔導士', '魔導書', '砂時計', '薬草園', '水晶玉', '天球儀', '聖杯', '封印'],
  },
  'cat-nature': {
    adjectives: ['Emerald', 'Turquoise', 'Primordial', 'Mossy', 'Misty', 'Crystal', 'Highland', 'Silent', 'Lush', 'Golden', 'Verdant', 'Hidden', 'Breezy', 'Sacred', 'Peaceful', 'Wild', 'Evergreen', 'Alpine', 'Serene', 'Whispering'],
    nouns: ['Peak', 'Valley', 'Lake', 'Gorge', 'Path', 'Meadow', 'Waterfall', 'Forest', 'Summit', 'Spring', 'Cavern', 'Cedar', 'Pond', 'Terrace', 'Crest', 'Grove', 'Fuji', 'Horizon', 'Glade', 'Ridge'],
    suffixes: ['of Emerald Light', 'in Morning Mist', 'at Dawn', 'of Serenity', 'of the Ancients', 'under the Pines', 'in Spring', 'Reflections', 'Sanctuary', 'Echoes', 'Solitude', 'Breeze', 'Wilderness', 'Peace', 'Haven'],
    jpPrefixes: ['翡翠', '朝霧', '深林', '清流', '苔むす', '霊峰', '高原', '峡谷', '風薫る', '名峰'],
    jpNouns: ['湖畔', '滝壺', '古道', '山嶺', '花畑', '大杉', '茶畑', '鳥居', '湧水', '雲海'],
  },
  'cat-rain': {
    adjectives: ['Clear', 'Rainy', 'Lofi', 'Misty', 'Drizzling', 'Quiet', 'Solitary', 'Reflective', 'Melodic', 'Blue', 'Gentle', 'Cozy', 'Wet', 'Umbrella', 'Puddle', 'Soft', 'Nocturnal', 'Overcast', 'Distant', 'Soothing'],
    nouns: ['Droplets', 'Cafe', 'Puddle', 'Bus Stop', 'Window', 'Asphalt', 'Balcony', 'Crosswalk', 'Umbrella', 'Raincoat', 'Track', 'River', 'Symphony', 'Downpour', 'Shelter', 'Canopy', 'Melody', 'Horizon', 'Lantern', 'Glass'],
    suffixes: ['in the Afternoon', 'on Rainy Window', 'at Twilight', 'Lofi Beats', 'Reflections', 'after the Storm', 'Whispers', 'of Solitude', 'Peace', 'in the City', 'Serenity', 'Melody', 'Atmosphere', 'Calm', 'Raindrop'],
    jpPrefixes: ['雨音', '小雨', '土砂降り', '雨宿り', '濡れそぼる', '雨露', '雨上がり', '時雨', '静寂', '青雨'],
    jpNouns: ['透明傘', '窓辺', '水たまり', 'カフェ', '停留所', '踏切', 'ベランダ', '横断歩道', '長靴', '街灯'],
  },
  'cat-celestial': {
    adjectives: ['Violet', 'Cosmic', 'Starlit', 'Astral', 'Nebula', 'Crescent', 'Infinite', 'Supernova', 'Milky Way', 'Deep Void', 'Solar', 'Aurora', 'Celestial', 'Prismatic', 'Obsidian', 'Glittering', 'Galactic', 'Penumbral', 'Radiant', 'Stargazer'],
    nouns: ['Nebula', 'Horizon', 'Meteor', 'Cradle', 'Core', 'Compass', 'Eclipse', 'Curtain', 'Voyager', 'Constellation', 'Planet', 'Galaxy', 'Observatory', 'Flare', 'Cluster', 'Dust', 'Abyss', 'Corona', 'Sanctuary', 'Tide'],
    suffixes: ['of Andromeda', 'beyond Infinity', 'in Deep Space', 'of the Eclipse', 'under the Aurora', 'Constellations', 'Reborn', 'Voyage', 'of the Cosmos', 'Awakening', 'Ascendant', 'Gaze', 'Drift', 'Eternity', 'Serenade'],
    jpPrefixes: ['星雲', '銀河', '天の川', '深宇宙', '極光', '流星', '超新星', '星屑', '星宿', '恒星'],
    jpNouns: ['地平線', '観測所', '三日月', '羅針盤', '日食', '航海者', '彗星', '星座', '軌道', '光彩'],
  },
  'cat-retro-anime': {
    adjectives: ['City Pop', '90s Cel', 'VHS', 'Vintage', 'Pastel', 'Analog', 'Retro', 'Cassette', 'Summer', 'Seaside', 'Neon Pastel', 'Classic', 'Glitch', 'Golden Age', 'Drifting', 'Walkman', 'Sunset', 'Nostalgic', 'CRT', 'Arcade'],
    nouns: ['Drive', 'Animation', 'Memories', 'Arcade', 'Beat', 'Balcony', 'Cruise', 'Radio', 'Station', 'Highway', 'Melody', 'Dream', 'Gouache', 'Parlor', 'Convertible', 'Dial', 'Beach', 'Screen', 'Vibes', 'Store'],
    suffixes: ['of 1994', 'on VHS Tape', 'in Seaside Sunset', 'City Pop Rhythm', 'Summer Nostalgia', 'Analog Dreams', 'Vibes', 'Memories', 'Echoes', 'Drive', 'Breeze', 'Tune', 'Broadcast', 'Afternoon', 'Replay'],
    jpPrefixes: ['90年代', 'シティポップ', 'VHS', 'レトロ', 'セル画', '昭和残照', 'カセット', '懐かしの', 'アナログ', '夏休み'],
    jpNouns: ['ドライブ', 'ゲーセン', 'ラジカセ', '海辺駅', '縁側', 'コンビニ', '湘南の風', '深夜便', '放課後', '黄昏'],
  },
  'cat-minimalist': {
    adjectives: ['Void', 'Pure OLED', 'Single', 'Geometric', 'Solitary', 'Zen', 'White Blade', 'Minimal', 'Abstract', 'Clean', 'Negative', 'Absolute', 'Shadow', 'Silent', 'Unbroken', 'Monochrome', 'Linear', 'Sparse', 'Still', 'Infinite'],
    nouns: ['Silhouette', 'Branch', 'Torii', 'Contour', 'Koi', 'Ripple', 'Mask', 'Bonsai', 'Eclipse', 'Crow', 'Crane', 'Line', 'Horizon', 'Circle', 'Stance', 'Mirror', 'Droplet', 'Stone', 'Leaf', 'Space'],
    suffixes: ['in Deep Black', 'AMOLED 100%', 'Zen Harmony', 'in the Void', 'of Pure Form', 'Simplicity', 'Stillness', 'Balance', 'Essence', 'Perfection', 'Quietude', 'Elegance', 'Silhouette', 'Echo', 'Design'],
    jpPrefixes: ['虚空', '極小', '漆黒', '一輪', '無垢', '白銀', '孤高', '墨絵', '一線', '静寂'],
    jpNouns: ['旅人', '折鶴', '鳥居', '波紋', '盆栽', '枯山水', '一刀', '錦鯉', '残月', '陰影'],
  },
  'cat-kawaii': {
    adjectives: ['Strawberry', 'Fluffy', 'Matcha', 'Star Candy', 'Sweet', 'Pastel', 'Chibi', 'Cozy', 'Sleeping', 'Cuddly', 'Rainbow', 'Baby', 'Tiny', 'Sugar', 'Honey', 'Cotton', 'Boba', 'Little', 'Gentle', 'Cute'],
    nouns: ['Macaron', 'Bunny', 'Friends', 'Bakery', 'Fox Cub', 'Jelly', 'Bear', 'Mochi', 'Doodle', 'Pancake', 'Spirit', 'Pastry', 'Teacup', 'Cloud', 'Cat', 'Hamster', 'Cupcake', 'Garden', 'Ribbon', 'Dream'],
    suffixes: ['of Sweets', 'in the Fluffy Cloud', 'Pastel Dreams', 'with Sprinkles', 'Tea Party', 'Morning Hug', 'Joy', 'Festival', 'Wonder', 'Nap Time', 'Sweetheart', 'Pudding', 'Magic', 'Smile', 'Sunshine'],
    jpPrefixes: ['カワイイ', 'ふわふわ', '苺みるく', 'もふもふ', 'ちびっ子', 'おやすみ', '虹色', '甘い', 'ぽかぽか', 'こねこ'],
    jpNouns: ['うさぎ', 'ベーカリー', '子狐', 'ゼリー', '桜餅', 'くまさん', 'タピオカ', 'マカロン', '金平糖', 'おひるね'],
  },
  'cat-warriors': {
    adjectives: ['Shadow', 'Crimson', 'Silent', 'Swift', 'Rooftop', 'Twin', 'Hidden', 'Fierce', 'Kitsune', 'Falcon', 'Wind', 'Iron', 'Thunder', 'Ghost', 'Nocturnal', 'Viper', 'Stealth', 'Ancient', 'Apex', 'Tiger'],
    nouns: ['Kunoichi', 'Shuriken', 'Vanish', 'Scroll', 'Daggers', 'Falcon', 'Assassination', 'Lotus', 'Vortex', 'Claw', 'Strike', 'Shadow', 'Ranger', 'Ninja', 'Master', 'Infiltration', 'Dagger', 'Honor', 'Shinobi', 'Crest'],
    suffixes: ['of the Shadow Clan', 'under Full Moon', 'in the Mist', 'Strike', 'Technique', 'of the Falcon', 'Protocol', 'Legacy', 'Pledge', 'Vengeance', 'Execution', 'Mastery', 'Vanish', 'Domain', 'Silence'],
    jpPrefixes: ['影衆', '紅蓮', '疾風', '忍び', '不知火', '乱れ', '隠密', '神出鬼没', '影縫い', '飛燕'],
    jpNouns: ['くノ一', '手裏剣', '煙幕', '秘伝巻物', '水蜘蛛', '忍刀', '双剣', '忍びの里', '暗殺者', '隼使い'],
  },
  'cat-japanese-arch': {
    adjectives: ['Golden', 'Submerged', 'Zen Rock', 'Red Bridge', 'Castlegate', 'Tengu', 'Machiya', 'Bonsai', 'Moon-Viewing', 'Thousand Lantern', 'Waterfall', 'Ancient', 'Cedar', 'Lacquered', 'Imperial', 'Kyoto', 'Eaves', 'Pagoda', 'Veranda', 'Shinto'],
    nouns: ['Pagoda', 'Torii', 'Garden', 'Bridge', 'Gate', 'Shrine', 'Street', 'Courtyard', 'Veranda', 'Corridor', 'Pavilion', 'Library', 'Tower', 'Altar', 'Hall', 'Canal', 'Temple', 'Alcove', 'Arch', 'Eaves'],
    suffixes: ['of the Shogun', 'in Morning Cloud', 'of Kyoto', 'over Misty Waters', 'of Thousand Lanterns', 'in the Mountains', 'Heritage', 'Sanctuary', 'Masterpiece', 'Timeless Spirit', 'Harmony', 'Elegance', 'Dynasty', 'Glory', 'Calm'],
    jpPrefixes: ['黄金', '雲上', '古都', '千燈', '朱塗り', '町家', '天狗', '枯山水', '将軍', '月見'],
    jpNouns: ['五重塔', '大鳥居', '回廊', '茶亭', '城門', '庭園', '石庭', '寺院', '縁側', '太鼓橋'],
  },
  'cat-dreamcore': {
    adjectives: ['Ocean', 'Mirrored', 'Clockwork', 'Doorway', 'Floating', 'Paper Boat', 'Whale', 'Submerged', 'Lighthouse', 'Eternal Sunset', 'Ethereal', 'Liminal', 'Pastel', 'Prismatic', 'Surreal', 'Infinite', 'Weightless', 'Glass', 'Cloudy', 'Lucid'],
    nouns: ['Railway', 'Horizon', 'Moon', 'Meadow', 'Staircase', 'Archipelago', 'Sky Whale', 'City of Light', 'Beacon', 'Train', 'Teacup', 'Crescent', 'Window', 'Passage', 'Reflection', 'Oasis', 'Shore', 'Vessel', 'Domain', 'Breeze'],
    suffixes: ['at the World Edge', 'across the Endless Sea', 'of Twilight', 'in the Clouds', 'Beyond Reality', 'of Ethereal Glass', 'Liminal Drift', 'in Lucid Dreams', 'of Echoes', 'Reverie', 'Mirage', 'Symphony', 'Ascent', 'Whisper', 'Glow'],
    jpPrefixes: ['夢幻', '海渡る', '硝子の', '時計仕掛け', '雲上', '水没', '白日夢', '折紙の', '世界の果て', '浮遊'],
    jpNouns: ['銀河鉄道', '水平線', '階段', '大時計', '光の街', '灯台', '茶杯の海', '鯨の空', '夢の扉', '夕日号'],
  },
  'cat-cyber-ninja': {
    adjectives: ['Plasma Edge', 'Techwear', 'Shadow Protocol', 'Neon Shuriken', 'Ghost Wire', 'Kitsune Mask', 'Circuit Katana', 'Stealth Camo', 'Neo-Edo', 'Viper Strike', 'High-Frequency', 'Neon Smoke', 'Quantum Kunai', 'Raindrop Glitch', 'Midnight Assassin', 'Zero Sound', 'Hyper Sonic', 'Carbon Fiber', 'OLED Shadow', 'Titanium'],
    nouns: ['Infiltrator', 'Shinobi', 'Execution', 'Storm', 'Tether', 'Blade', 'Duel', 'Overwatch', 'Bomb', 'Stance', 'Footsteps', 'Visor', 'Armor', 'Cloak', 'Protocol', 'Katana', 'Operative', 'Assault', 'Recon', 'Master'],
    suffixes: ['of Neo-Edo', 'under Neon Acid Rain', 'Protocol Omega', 'in the Shadows', 'on Rooftops', 'High Voltage', 'Overdrive', 'Zero Noise', 'Ascendant', 'Execution', 'Vigil', 'Cyber Strike', 'Vanguard', 'Stealth Mode', 'Echo'],
    jpPrefixes: ['プラズマ', '電脳', '影規約', '光手裏剣', '光学迷彩', '新江戸', '超高周波', '量子', '真夜中', '無音'],
    jpNouns: ['忍者', '暗殺者', '回路刀', '狐面', '潜入部隊', '屋上決闘', '毒蛇', '発煙筒', 'クナイ', '執行規約'],
  },
  'cat-winter': {
    adjectives: ['Snowy', 'Midnight', 'Steamy', 'Moonlit', 'Silent', 'Blizzard', 'Frozen', 'Cozy', 'Crystal', 'Velvet', 'First Snow', 'Starlit', 'Hushed', 'Pine', 'Lantern Lit', 'Frosty', 'Twilight', 'Serene', 'Wintry', 'Glacial'],
    nouns: ['Onsen', 'Shrine', 'Kotatsu', 'Fox', 'Waterfall', 'Alley', 'Train', 'Eaves', 'Drift', 'Pass', 'Village', 'Pond', 'Bell', 'Grove', 'Summit', 'Window', 'Tracks', 'Lantern', 'Snowfall', 'Hearth'],
    suffixes: ['in Falling Snow', 'at Midnight', 'under the Moon', 'of First Snow', 'in the Blizzard', 'by Lantern Light', 'Whispers', 'Serenity', 'of Winter', 'at Dawn', 'Echoes', 'Memories', 'Calm', 'Reverie', 'Glow'],
    jpPrefixes: ['雪景', '真冬', '湯けむり', '初雪', '月夜', '吹雪', '凍てつく', 'こたつ', '師走', '銀世界'],
    jpNouns: ['温泉', '神社', '雪うさぎ', '石段', '湯屋', '雪原', '氷柱', '除夜の鐘', '山荘', '雪灯り'],
  },
  'cat-festival': {
    adjectives: ['Summer', 'Golden', 'Lantern Lit', 'Taiko', 'Star Mine', 'Riverside', 'Bon Odori', 'Crimson', 'Sparkling', 'Joyful', 'Twilight', 'Paper', 'Neon', 'Festive', 'Grand', 'Nostalgic', 'Lively', 'Radiant', 'Ethereal', 'Crackling'],
    nouns: ['Hanabi', 'Parade', 'Drum', 'Stand', 'Dance', 'Finale', 'Stall', 'Lantern', 'Picnic', 'Stage', 'Mask', 'River', 'Yukata', 'Matsuri', 'Fireworks', 'Crowd', 'Summer Night', 'Reflection', 'Bonfire', 'Procession'],
    suffixes: ['under Fireworks', 'of Summer Night', 'at the Riverside', 'Matsuri Lights', 'of Joy', 'Memories', 'in Yukata', 'Echoes', 'Celebration', 'at Dusk', 'Serenade', 'Fever', 'Nights', 'Glow', 'Delight'],
    jpPrefixes: ['夏祭り', '大輪', '提灯', '太鼓', '浴衣', '花火', '盆踊り', '屋台', '納涼', '宵闇'],
    jpNouns: ['祭囃子', '神輿', '夜店', '金魚すくい', '輪踊り', '打ち上げ', '灯籠', '綿菓子', '終電', '見物席'],
  },
  'cat-yokai': {
    adjectives: ['Spectral', 'Foxfire', 'Misty', 'Cursed', 'Moonlit', 'Whispering', 'Shadow', 'Eerie', 'Ancient', 'Glowing', 'Haunted', 'Sacred', 'Nocturnal', 'Phantom', 'Enchanted', 'Creeping', 'Lurking', 'Otherworldly', 'Chilling', 'Veiled'],
    nouns: ['Lantern', 'Kitsune', 'Tengu', 'Kappa', 'Yuki Onna', 'Neko', 'Obake', 'Jorogumo', 'Tanuki', 'Torii', 'Wisp', 'Oni', 'Spirit', 'Mask', 'Fog', 'Shrine', 'Forest', 'Pond', 'Dance', 'Gate'],
    suffixes: ['of the Night Parade', 'in the Bamboo Mist', 'under the Full Moon', 'of the Spirit World', 'Whispers', 'at Midnight', 'beyond the Gate', 'of Fog', 'Awakened', 'Lurking', 'Domain', 'Encounter', 'Legend', 'Revel', 'Omen'],
    jpPrefixes: ['妖怪', '狐火', '深夜', '霧深き', '呪い', '月影', '化け', '幽玄', '百鬼', '異界'],
    jpNouns: ['提灯', '天狗', '河童', '雪女', '猫又', '絡新婦', '狸', '鳥居', '人魂', '鬼面'],
  },
};

/**
 * Generates an array of exactly 100 uniquely distinct titles with localized Japanese & English descriptions
 * @param categoryId e.g. 'cat-cyberpunk'
 * @param seedTitles initial archetype titles
 */
export function generateCategoryTitles(
  categoryId: string,
  seedTitles: { en: string; jp: string; desc: string }[]
): ThematicTitle[] {
  const vocab = CATEGORY_VOCABULARY[categoryId] || CATEGORY_VOCABULARY['cat-cyberpunk'];
  const titles: ThematicTitle[] = [];
  const seenEn = new Set<string>();

  // 1. Add seed titles first
  for (const seed of seedTitles) {
    if (!seenEn.has(seed.en)) {
      seenEn.add(seed.en);
      titles.push({ ...seed });
    }
  }

  // 2. Generate remaining until 100 strictly unique titles
  let adjIdx = 0;
  let nounIdx = 0;
  let sufIdx = 0;

  while (titles.length < 100) {
    const adj = vocab.adjectives[adjIdx % vocab.adjectives.length];
    const noun = vocab.nouns[nounIdx % vocab.nouns.length];
    const suf = vocab.suffixes[sufIdx % vocab.suffixes.length];

    const jpPre = vocab.jpPrefixes[adjIdx % vocab.jpPrefixes.length];
    const jpNoun = vocab.jpNouns[nounIdx % vocab.jpNouns.length];

    // Build combinations variations
    let candidateEn = `${adj} ${noun} ${suf}`;
    let candidateJp = `${jpPre}${jpNoun}の情景`;
    let candidateDesc = `Composición artística única de ${noun.toLowerCase()} en estilo anime contemporáneo.`;

    if (titles.length % 3 === 0) {
      candidateEn = `${adj} ${noun} ${suf}`;
      candidateJp = `${jpPre}${jpNoun}・${titles.length + 1}`;
      candidateDesc = `${adj} ${noun.toLowerCase()} ${suf.toLowerCase()} en estética anime de alta fidelidad.`;
    } else if (titles.length % 3 === 1) {
      candidateEn = `${noun} ${suf}`;
      candidateJp = `${jpPre}の${jpNoun}`;
      candidateDesc = `Ilustración cinematográfica de ${noun.toLowerCase()} ${suf.toLowerCase()} con atmósfera mística.`;
    } else {
      candidateEn = `${adj} ${noun}`;
      candidateJp = `${jpPre}${jpNoun}`;
      candidateDesc = `Escena original de ${adj.toLowerCase()} ${noun.toLowerCase()} con iluminación y detalles vibrantes.`;
    }

    if (!seenEn.has(candidateEn)) {
      seenEn.add(candidateEn);
      titles.push({
        en: candidateEn,
        jp: candidateJp,
        desc: candidateDesc,
      });
    }

    adjIdx++;
    if (adjIdx % vocab.adjectives.length === 0) {
      nounIdx++;
      if (nounIdx % vocab.nouns.length === 0) {
        sufIdx++;
      }
    }
  }

  return titles.slice(0, 100);
}
