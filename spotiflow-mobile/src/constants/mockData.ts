import type { ImageProps } from 'expo-image';
import type { Playlist, Track } from '../types/music';

export type { Playlist, Track } from '../types/music';

export const DEFAULT_PLAYLIST_COVER_URL =
  'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80';
export const DEFAULT_PLAYLIST_COVER_SOURCE: ImageProps['source'] = require('../../assets/images/echos-of-us.png');

export const INITIAL_TRACK_QUERY = 'Exagerado Cazuza';

export interface Category {
  id: string;
  title: string;
  color: string;
  imageUrl: string;
}

export interface FriendActivity {
  id: string;
  name: string;
  avatarUrl: string;
  avatarSource?: ImageProps['source'];
  currentTrack?: string;
  currentArtist?: string;
  lastActive: string;
  playlists: Playlist[];
}

export interface SharedTrackRef {
  title: string;
  artist: string;
  coverUrl: string;
  query: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  sharedTrack?: Track;
  sharedTrackRef?: SharedTrackRef;
}

export interface DirectMessage {
  id: string;
  senderName: string;
  avatarUrl: string;
  avatarSource?: ImageProps['source'];
  previewText: string;
  date: string;
  messages: ChatMessage[];
}

export interface UserProfileData {
  name: string;
  plan: string;
  avatarUrl: string;
  avatarSource?: ImageProps['source'];
}

// Playlists curadas do usuário — faixas resolvidas ao vivo na Deezer API para garantir áudio reproduzível
export const CURATED_PLAYLISTS: Playlist[] = [
  {
    id: 'echos-of-us',
    title: 'Echos of us',
    subtitle: 'Playlist mixada • Jão',
    author: 'Jão',
    coverUrl:
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    coverSource: require('../../assets/images/echos-of-us.png'),
    isMixed: true,
    isDownloaded: true,
    tracksCount: 15,
    tracks: [],
    trackQueries: [
      'One-Winged Angel Nobuo Uematsu',
      'Hollow Nobuo Uematsu',
      'Silver for Monsters Marcin Przybyłowicz',
      'The Fields of Ard Skellig Marcin Przybyłowicz',
      'Main Theme of Final Fantasy VII Nobuo Uematsu',
      'Geralt of Rivia Marcin Przybyłowicz',
      "Aerith's Theme Nobuo Uematsu",
      'Steel for Humans Marcin Przybyłowicz',
      'Kaer Morhen Marcin Przybyłowicz',
      'Exagerado Cazuza',
      'Codinome Beija-Flor Cazuza',
      'O Tempo Não Para Cazuza',
      'Ideologia Cazuza',
      'Pro Dia Nascer Feliz Barão Vermelho',
      'Segredos Frejat',
    ],
  },
  {
    id: 'my-peace',
    title: 'My peace',
    subtitle: 'Playlist • Jão',
    author: 'Jão',
    coverUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    isPinned: true,
    isDownloaded: true,
    tracksCount: 10,
    tracks: [],
    trackQueries: [
      'Vento no Litoral Legião Urbana',
      'Como Nossos Pais Elis Regina',
      'Coração Vagabundo Caetano Veloso',
      'Travessia Milton Nascimento',
      'Drão Gilberto Gil',
      'Clube da Esquina 2 Milton Nascimento',
      'O Leãozinho Caetano Veloso',
      'Anunciação Alceu Valença',
      'Pais e Filhos Legião Urbana',
      'Águas de Março Elis Regina',
    ],
  },
  {
    id: 'on-my-mind',
    title: 'on my mind',
    subtitle: 'Playlist mixada • Jão',
    author: 'Jão',
    coverUrl:
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80',
    isMixed: true,
    isDownloaded: true,
    tracksCount: 10,
    tracks: [],
    trackQueries: [
      'Starboy The Weeknd',
      'Blinding Lights The Weeknd',
      'Passionfruit Drake',
      'Nights Frank Ocean',
      'Snooze SZA',
      'goosebumps Travis Scott',
      'Die For You The Weeknd',
      "God's Plan Drake",
      'Pink + White Frank Ocean',
      'Kill Bill SZA',
    ],
  },
  {
    id: 'dyanassics-jao',
    title: 'Dyanassics + Jão',
    subtitle: 'Playlist • Spotify Match',
    author: 'Spotify',
    coverUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    isDownloaded: false,
    tracksCount: 10,
    tracks: [],
    trackQueries: [
      'Idiota Jão',
      'Me Lambe Jão',
      'Bixinho Duda Beat',
      'Por Supuesto Marina Sena',
      'A Cor É Rosa Silva',
      'Vermelho Gloria Groove',
      'Alinhamento Milenar Jão',
      'Essa Eu Fiz Pro Nosso Amor Jão',
      'Dando Mais um Tempo Duda Beat',
      'Amarelo, Azul e Branco ANAVITÓRIA',
    ],
  },
  {
    id: 'liked-songs',
    title: 'musicas curtidas do ian',
    subtitle: 'Playlist • Jão',
    author: 'Jão',
    coverUrl:
      'https://images.unsplash.com/photo-1499415479124-43c32433a620?w=600&q=80',
    isDownloaded: true,
    tracksCount: 12,
    tracks: [],
    trackQueries: [
      'SUV PRATA LEALL',
      'Quer Voar Matuê',
      'Talvez você precise de mim Veigh',
      'Gorilla Roxo Matuê',
      'Clareou Thiaguinho',
      'Anos Luz Matuê',
      'Kenny G Matuê',
      'Máquina do Tempo Matuê',
      'Conexões de Máfia Matuê',
      'Vampiro Matuê',
      'Flow Espacial Teto',
      'Novo Balanço Veigh',
    ],
  },
  {
    id: 'kpop-crl',
    title: 'kpop e os crl',
    subtitle: 'Playlist • Jão',
    author: 'Jão',
    coverUrl:
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80',
    coverSource: require('../../assets/images/kpop-cover.png'),
    isDownloaded: false,
    tracksCount: 10,
    tracks: [],
    trackQueries: [
      'Super Shy NewJeans',
      'Dynamite BTS',
      'Pink Venom BLACKPINK',
      'ANTIFRAGILE LE SSERAFIM',
      "God's Menu Stray Kids",
      'Ditto NewJeans',
      'Hype Boy NewJeans',
      'How You Like That BLACKPINK',
      'Boy With Luv BTS',
      'FEARLESS LE SSERAFIM',
    ],
  },
  {
    id: 'rock-classics-arena',
    title: 'Rock & Clássicos de Arena',
    subtitle: 'Playlist mixada • Clássicos e guitarras pesadas',
    author: 'Spotiflow',
    coverUrl:
      'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80',
    isMixed: true,
    isDownloaded: true,
    tracksCount: 10,
    tracks: [],
    trackQueries: [
      'Bohemian Rhapsody Queen',
      'Smells Like Teen Spirit Nirvana',
      'Back In Black AC/DC',
      'Hotel California Eagles',
      'Sweet Child O Mine Guns N Roses',
      'Stairway to Heaven Led Zeppelin',
      'Enter Sandman Metallica',
      'Livin On A Prayer Bon Jovi',
      'Paranoid Black Sabbath',
      'Tempo Perdido Legião Urbana',
    ],
  },
  {
    id: 'rock-alternativo-indie',
    title: 'Rock Alternativo & Indie',
    subtitle: 'Playlist • Arctic Monkeys, Linkin Park e mais',
    author: 'Spotiflow',
    coverUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    isDownloaded: false,
    tracksCount: 10,
    tracks: [],
    trackQueries: [
      'Do I Wanna Know Arctic Monkeys',
      'Mr. Brightside The Killers',
      'Numb Linkin Park',
      'Everlong Foo Fighters',
      'Seven Nation Army The White Stripes',
      'Creep Radiohead',
      'Californication Red Hot Chili Peppers',
      'Take Me Out Franz Ferdinand',
      'Last Nite The Strokes',
      'Anna Júlia Los Hermanos',
    ],
  },
  {
    id: 'kpop-neon-hits',
    title: 'K-Pop Neon Hits',
    subtitle: 'Playlist mixada • aespa, Stray Kids, NewJeans',
    author: 'Spotiflow',
    coverUrl:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    isMixed: true,
    isDownloaded: true,
    tracksCount: 10,
    tracks: [],
    trackQueries: [
      'APT. ROSÉ Bruno Mars',
      'Magnetic ILLIT',
      'Drama aespa',
      'Supernova aespa',
      'LALALALA Stray Kids',
      'Kill This Love BLACKPINK',
      'Seven Jungkook',
      'OMG NewJeans',
      'Love Dive IVE',
      'What is Love TWICE',
    ],
  },
  {
    id: 'eletronica-night-drive',
    title: 'Eletrônica & Night Drive',
    subtitle: 'Playlist mixada • Synthwave, House e EDM',
    author: 'Spotiflow',
    coverUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    isMixed: true,
    isDownloaded: false,
    tracksCount: 10,
    tracks: [],
    trackQueries: [
      'One More Time Daft Punk',
      'Midnight City M83',
      'Titanium David Guetta',
      'Wake Me Up Avicii',
      'Hear Me Now Alok',
      'Summer Calvin Harris',
      'Innerbloom RÜFÜS DU SOL',
      'Strobe deadmau5',
      'Glue Bicep',
      'Turn On The Lights again Fred again',
    ],
  },
  {
    id: 'hiphop-trap-brasil',
    title: 'Hip-Hop & Trap Nacional',
    subtitle: 'Playlist • Batidas graves, rap BR e gringo',
    author: 'Spotiflow',
    coverUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    isDownloaded: true,
    tracksCount: 10,
    tracks: [],
    trackQueries: [
      'HUMBLE. Kendrick Lamar',
      'SICKO MODE Travis Scott',
      'Lose Yourself Eminem',
      'A Vida É Desafio Racionais MCs',
      'Negro Drama Racionais MCs',
      'Poesia Acústica 2',
      'Crack com Mussilon Matuê',
      'Melhor Só KayBlack',
      'Ainda Bem Djonga',
      'Leal Djonga',
    ],
  },
  {
    id: 'samba-pagode-raiz',
    title: 'Samba, Pagode & Brasilidade',
    subtitle: 'Playlist • Roda de samba e clássicos nacionais',
    author: 'Spotiflow',
    coverUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    isDownloaded: false,
    tracksCount: 10,
    tracks: [],
    trackQueries: [
      'Deixa Acontecer Grupo Revelação',
      'Tá Escrito Grupo Revelação',
      'Cheia de Manias Raça Negra',
      'Pé na Areia Diogo Nogueira',
      'O Show Tem Que Continuar Fundo de Quintal',
      'Falta Você Thiaguinho',
      'Lancinho Turma do Pagode',
      'Coração Radiante Grupo Revelação',
      'Aquarela do Brasil Ary Barroso',
      'Wave Tom Jobim',
    ],
  },
];

// Categorias e Gêneros da Tela de Busca (disparam busca real na Deezer)
export const SEARCH_CATEGORIES: Category[] = [
  { id: 'musica', title: 'Música', color: '#E8115B', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80' },
  { id: 'podcasts', title: 'Podcasts', color: '#148A08', imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&q=80' },
  { id: 'eventos', title: 'Pop', color: '#7358FF', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80' },
  { id: 'fitness', title: 'Eletrônica', color: '#503750', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&q=80' },
  { id: 'brasil', title: 'Brasil', color: '#1E3264', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80' },
  { id: 'radar', title: 'Sertanejo', color: '#006450', imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=80' },
  { id: 'rock', title: 'Rock', color: '#BC5900', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=200&q=80' },
  { id: 'mpb', title: 'MPB', color: '#E91429', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80' },
  { id: 'kpop', title: 'K-Pop', color: '#AF2896', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&q=80' },
  { id: 'indie', title: 'Indie', color: '#477D95', imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&q=80' },
  { id: 'hiphop', title: 'Hip-Hop', color: '#BA5D07', imageUrl: 'https://images.unsplash.com/photo-1499415479124-43c32433a620?w=200&q=80' },
  { id: 'samba', title: 'Samba', color: '#27856A', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80' },
];

// Perfil padrão para sessão local de demonstração
export const USER_PROFILE: UserProfileData = {
  name: 'Jão',
  plan: 'Universitário',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  avatarSource: require('../../assets/images/jao-profile.jpg'),
};

// Amigos e suas playlists públicas (faixas resolvidas ao vivo na Deezer API)
export const FRIENDS_ACTIVITY: FriendActivity[] = [
  {
    id: 'friend-1',
    name: 'Gabriela',
    avatarUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
    currentTrack: 'Cardigan',
    currentArtist: 'Taylor Swift',
    lastActive: 'Ouvindo agora',
    playlists: [
      {
        id: 'gabi-indie-vibes',
        title: 'Indie & Sad Girl',
        subtitle: 'Playlist • Gabriela',
        author: 'Gabriela',
        coverUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
        tracksCount: 6,
        tracks: [],
        trackQueries: [
          'sangrar Arthur',
          'Cardigan Taylor Swift',
          'Video Games Lana Del Rey',
          'Motion Sickness Phoebe Bridgers',
          'Space Song Beach House',
          'The Night We Met Lord Huron',
        ],
      },
      {
        id: 'gabi-pop-hits',
        title: 'Acoustic Sunday',
        subtitle: 'Playlist • Gabriela',
        author: 'Gabriela',
        coverUrl:
          'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80',
        tracksCount: 6,
        tracks: [],
        trackQueries: [
          'Banana Pancakes Jack Johnson',
          'Put Your Records On Corinne Bailey Rae',
          'Better Together Jack Johnson',
          'Fast Car Tracy Chapman',
          'Sunday Morning Maroon 5',
          'Here Comes The Sun The Beatles',
        ],
      },
    ],
  },
  {
    id: 'friend-2',
    name: 'Márcio Garrido',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    avatarSource: require('../../assets/images/marcio-garrido.png'),
    currentTrack: 'Back in Black',
    currentArtist: 'AC/DC',
    lastActive: 'Ouvindo no talo',
    playlists: [
      {
        id: 'garrido-hard-rock',
        title: 'Hard Rock Classics',
        subtitle: 'Playlist • Márcio Garrido',
        author: 'Márcio Garrido',
        coverUrl:
          'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80',
        tracksCount: 6,
        tracks: [],
        trackQueries: [
          'Back in Black AC/DC',
          'Highway to Hell AC/DC',
          'Thunderstruck AC/DC',
          "Sweet Child O' Mine Guns N' Roses",
          'Smoke on the Water Deep Purple',
          'You Shook Me All Night Long AC/DC',
        ],
      },
      {
        id: 'garrido-metal-workout',
        title: 'Heavy Metal & Code',
        subtitle: 'Playlist • Márcio Garrido',
        author: 'Márcio Garrido',
        coverUrl:
          'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600&q=80',
        tracksCount: 6,
        tracks: [],
        trackQueries: [
          'Master of Puppets Metallica',
          'The Trooper Iron Maiden',
          'Paranoid Black Sabbath',
          'Fear of the Dark Iron Maiden',
          'Symphony of Destruction Megadeth',
          'Enter Sandman Metallica',
        ],
      },
    ],
  },
  {
    id: 'friend-3',
    name: 'Camila',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    currentTrack: 'Blue in Green',
    currentArtist: 'Miles Davis',
    lastActive: 'Há 1h',
    playlists: [
      {
        id: 'camila-lofi-beats',
        title: 'Lo-Fi Study Beats',
        subtitle: 'Playlist • Camila',
        author: 'Camila',
        coverUrl:
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
        tracksCount: 6,
        tracks: [],
        trackQueries: [
          'SaWaDiKa Fic',
          'Coffee in Rain Chilled Cow',
          'Controlla Idealism',
          'Again Wun Two',
          'Affection Jinsang',
          'feelings potsu',
        ],
      },
      {
        id: 'camila-jazz-focus',
        title: 'Jazz para focar',
        subtitle: 'Playlist • Camila',
        author: 'Camila',
        coverUrl:
          'https://images.unsplash.com/photo-1525994886773-080587e161c2?w=600&q=80',
        tracksCount: 6,
        tracks: [],
        trackQueries: [
          'Blue in Green Miles Davis',
          'Autumn Leaves Bill Evans Trio',
          'Take Five The Dave Brubeck Quartet',
          'My Favorite Things John Coltrane',
          'Round Midnight Thelonious Monk',
          'So What Miles Davis',
        ],
      },
    ],
  },
  {
    id: 'friend-4',
    name: 'Lucas Ferreira',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    currentTrack: 'Evidências',
    currentArtist: 'Chitãozinho & Xororó',
    lastActive: 'Ativado',
    playlists: [
      {
        id: 'lucas-sertanejo',
        title: 'Sertanejo Raiz',
        subtitle: 'Playlist • Lucas Ferreira',
        author: 'Lucas Ferreira',
        coverUrl:
          'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80',
        tracksCount: 6,
        tracks: [],
        trackQueries: [
          'Evidências Chitãozinho & Xororó',
          'Fio de Cabelo Chitãozinho & Xororó',
          'Pense em Mim Leandro & Leonardo',
          'O Menino da Porteira Sérgio Reis',
          'Nuvem de Lágrimas Chitãozinho & Xororó',
          'Boate Azul Joaquim & Manuel',
        ],
      },
      {
        id: 'lucas-modao',
        title: 'Modao de Estrada',
        subtitle: 'Playlist • Lucas Ferreira',
        author: 'Lucas Ferreira',
        coverUrl:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80',
        tracksCount: 6,
        tracks: [],
        trackQueries: [
          'Romaria Renato Teixeira',
          'Tocando em Frente Almir Sater',
          'Telefone Mudo Trio Parada Dura',
          'Chalana Almir Sater',
          'Um Violeiro Toca Almir Sater',
          'As Andorinhas Trio Parada Dura',
        ],
      },
    ],
  },
];

// Mensagens diretas
export const DIRECT_MESSAGES: DirectMessage[] = [
  {
    id: 'dm-1',
    senderName: 'Mariana Costa',
    avatarUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    previewText: 'Compartilhou uma música',
    date: '8 de abr.',
    messages: [
      {
        id: 'msg-1',
        sender: 'them',
        text: 'Ouve essa aqui depois, lembrei de você!',
        time: '14:20',
      },
      {
        id: 'msg-2',
        sender: 'them',
        text: 'Essa letra é perfeita demais:',
        time: '14:21',
        sharedTrackRef: {
          title: 'Exagerado',
          artist: 'Cazuza',
          coverUrl:
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
          query: 'Exagerado Cazuza',
        },
      },
      {
        id: 'msg-3',
        sender: 'me',
        text: 'Clássico absoluto! Vou colocar na fila agora.',
        time: '14:25',
      },
    ],
  },
  {
    id: 'dm-2',
    senderName: 'Felipe Santos',
    avatarUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
    previewText: 'Bora montar uma playlist nova',
    date: '7 de mar.',
    messages: [
      {
        id: 'msg-201',
        sender: 'them',
        text: 'Mano, aquela seleção de rock que você montou ficou animal!',
        time: '18:05',
      },
      {
        id: 'msg-202',
        sender: 'me',
        text: 'Valeu! Depois me manda mais recomendações.',
        time: '18:10',
      },
    ],
  },
];
