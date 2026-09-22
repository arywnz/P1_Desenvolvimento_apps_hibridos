import type { ImageSourcePropType } from 'react-native';

/**
 * Dados simulados (mock) para a aplicação Spotiflow
 * Baseado fielmente nos elementos de tela do Spotify
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  coverUrl: string;
  liked: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  coverUrl: string;
  isMixed?: boolean;
  isPinned?: boolean;
  isDownloaded?: boolean;
  tracksCount: number;
  tracks: Track[];
}

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
  avatarSource?: ImageSourcePropType;
  currentTrack?: string;
  currentArtist?: string;
  lastActive: string;
  playlists: Playlist[];
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  sharedTrack?: Track;
}

export interface DirectMessage {
  id: string;
  senderName: string;
  avatarUrl: string;
  previewText: string;
  date: string;
  messages: ChatMessage[];
}

// Faixa atual em reprodução (conforme o mini player dos prints)
export const CURRENT_TRACK: Track = {
  id: 'cazuza-exagerado',
  title: 'Exagerado',
  artist: 'Cazuza',
  album: 'Exagerado',
  duration: '3:34',
  durationSeconds: 214,
  coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
  liked: true,
};

// Playlists da Home e Biblioteca do usuário principal (Jão)
export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'echos-of-us',
    title: 'Echos of us',
    subtitle: 'Playlist mixada • Jão',
    author: 'Jão',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    isMixed: true,
    isDownloaded: true,
    tracksCount: 38,
    tracks: [
      CURRENT_TRACK,
      {
        id: 'track-2',
        title: 'Codinome Beija-Flor',
        artist: 'Cazuza',
        album: 'Cazuza',
        duration: '2:32',
        durationSeconds: 152,
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
        liked: true,
      },
      {
        id: 'track-3',
        title: 'O Tempo Não Para',
        artist: 'Cazuza',
        album: 'O Tempo Não Para',
        duration: '4:38',
        durationSeconds: 278,
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
        liked: false,
      },
      {
        id: 'track-4',
        title: 'Ideologia',
        artist: 'Cazuza',
        album: 'Ideologia',
        duration: '4:06',
        durationSeconds: 246,
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
        liked: true,
      },
    ],
  },
  {
    id: 'my-peace',
    title: 'My peace',
    subtitle: 'Playlist • Jão',
    author: 'Jão',
    coverUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80',
    isPinned: true,
    isDownloaded: true,
    tracksCount: 24,
    tracks: [
      {
        id: 'track-peace-1',
        title: 'Vento no Litoral',
        artist: 'Legião Urbana',
        album: 'V',
        duration: '6:06',
        durationSeconds: 366,
        coverUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80',
        liked: true,
      },
      {
        id: 'track-peace-2',
        title: 'Como Nossos Pais',
        artist: 'Elis Regina',
        album: 'Falso Brilhante',
        duration: '4:40',
        durationSeconds: 280,
        coverUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80',
        liked: true,
      },
    ],
  },
  {
    id: 'on-my-mind',
    title: 'on my mind',
    subtitle: 'Playlist mixada • Jão',
    author: 'Jão',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    isMixed: true,
    isDownloaded: true,
    tracksCount: 42,
    tracks: [],
  },
  {
    id: 'dyanassics-jao',
    title: 'Dyanassics + Jão',
    subtitle: 'Playlist • Spotify Match',
    author: 'Spotify',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80',
    isDownloaded: false,
    tracksCount: 50,
    tracks: [],
  },
  {
    id: 'liked-songs',
    title: 'Músicas curtidas',
    subtitle: 'Playlist • Shtorache',
    author: 'Shtorache',
    coverUrl: 'https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400&q=80',
    isDownloaded: true,
    tracksCount: 8,
    tracks: [
      {
        id: 'liked-suv-prata',
        title: 'SUV PRATA',
        artist: 'LEALL, Rock Danger, Babidi',
        album: 'SUV PRATA',
        duration: '3:01',
        durationSeconds: 181,
        coverUrl: 'https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400&q=80',
        liked: true,
      },
      {
        id: 'liked-quer-voar',
        title: 'Quer Voar',
        artist: 'Matuê',
        album: 'Quer Voar',
        duration: '2:55',
        durationSeconds: 175,
        coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80',
        liked: true,
      },
      {
        id: 'liked-talvez-voce-precise',
        title: 'Talvez você precise de mim',
        artist: 'Veigh, Supernova Ent',
        album: 'Talvez você precise de mim',
        duration: '3:28',
        durationSeconds: 208,
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
        liked: true,
      },
      {
        id: 'liked-gorilla-roxo',
        title: 'Gorilla Roxo',
        artist: 'Matuê',
        album: 'Gorilla Roxo',
        duration: '2:47',
        durationSeconds: 167,
        coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
        liked: true,
      },
      {
        id: 'liked-clareou',
        title: 'Clareou (Trilha Sonora Original)',
        artist: 'Thiaguinho, Negra Li',
        album: 'Clareou',
        duration: '3:40',
        durationSeconds: 220,
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
        liked: true,
      },
      {
        id: 'liked-anos-luz',
        title: 'Anos Luz',
        artist: 'Matuê',
        album: 'Anos Luz',
        duration: '3:13',
        durationSeconds: 193,
        coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
        liked: true,
      },
      {
        id: 'liked-kyoto',
        title: 'Kyoto',
        artist: 'Froid, Alaska',
        album: 'Kyoto',
        duration: '4:06',
        durationSeconds: 246,
        coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80',
        liked: true,
      },
      {
        id: 'liked-peita-de-dar-role',
        title: 'Peita de Dar Rolê',
        artist: 'Froid',
        album: 'Peita de Dar Rolê',
        duration: '2:58',
        durationSeconds: 178,
        coverUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80',
        liked: true,
      },
    ],
  },
  {
    id: 'kpop-crl',
    title: 'kpop e os crl',
    subtitle: 'Playlist • Jão',
    author: 'Jão',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    isDownloaded: false,
    tracksCount: 65,
    tracks: [],
  },
];

// Categorias e Gêneros da Tela de Busca
export const SEARCH_CATEGORIES: Category[] = [
  { id: 'musica', title: 'Música', color: '#E8115B', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80' },
  { id: 'podcasts', title: 'Podcasts', color: '#148A08', imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&q=80' },
  { id: 'eventos', title: 'Eventos ao vivo', color: '#7358FF', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80' },
  { id: 'fitness', title: 'Fitness', color: '#503750', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&q=80' },
  { id: 'brasil', title: 'Feito para você', color: '#1E3264', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80' },
  { id: 'radar', title: 'Próximos lançamentos', color: '#006450', imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=80' },
  { id: 'rock', title: 'Rock', color: '#BC5900', imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=200&q=80' },
  { id: 'mpb', title: 'MPB', color: '#E91429', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80' },
];

// Usuário logado
export const USER_PROFILE = {
  name: 'Shtorache',
  plan: 'Universitário',
  avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80',
};

// Amigos e Atividades com Playlists Exclusivas e Diferenciadas
export const FRIENDS_ACTIVITY: FriendActivity[] = [
  {
    id: 'friend-1',
    name: 'Gabriela',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    currentTrack: 'sangrar',
    currentArtist: 'Arthur',
    lastActive: 'Ouvindo agora',
    playlists: [
      {
        id: 'gabi-indie-vibes',
        title: 'Indie & Sad Girl',
        subtitle: 'Playlist • Gabriela',
        author: 'Gabriela',
        coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        tracksCount: 28,
        tracks: [
          {
            id: 'gabi-1',
            title: 'sangrar',
            artist: 'Arthur',
            album: 'Coração Partido',
            duration: '3:15',
            durationSeconds: 195,
            coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
            liked: false,
          },
          {
            id: 'gabi-2',
            title: 'Cardigan',
            artist: 'Taylor Swift',
            album: 'folklore',
            duration: '3:59',
            durationSeconds: 239,
            coverUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80',
            liked: true,
          },
          {
            id: 'gabi-3',
            title: 'Video Games',
            artist: 'Lana Del Rey',
            album: 'Born to Die',
            duration: '4:42',
            durationSeconds: 282,
            coverUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
            liked: true,
          },
        ],
      },
      {
        id: 'gabi-pop-hits',
        title: 'Acoustic Sunday',
        subtitle: 'Playlist • Gabriela',
        author: 'Gabriela',
        coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
        tracksCount: 19,
        tracks: [
          {
            id: 'gabi-acoustic-1',
            title: 'Banana Pancakes',
            artist: 'Jack Johnson',
            album: 'In Between Dreams',
            duration: '3:12',
            durationSeconds: 192,
            coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
            liked: true,
          },
          {
            id: 'gabi-acoustic-2',
            title: 'Put Your Records On',
            artist: 'Corinne Bailey Rae',
            album: 'Corinne Bailey Rae',
            duration: '3:35',
            durationSeconds: 215,
            coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
            liked: true,
          },
          {
            id: 'gabi-acoustic-3',
            title: 'Better Together',
            artist: 'Jack Johnson',
            album: 'In Between Dreams',
            duration: '3:27',
            durationSeconds: 207,
            coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
            liked: false,
          },
        ],
      },
    ],
  },
  {
    id: 'friend-2',
    name: 'Márcio Garrido',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
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
        coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80',
        tracksCount: 45,
        tracks: [
          {
            id: 'rock-1',
            title: 'Back in Black',
            artist: 'AC/DC',
            album: 'Back in Black',
            duration: '4:15',
            durationSeconds: 255,
            coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80',
            liked: true,
          },
          {
            id: 'rock-2',
            title: 'Highway to Hell',
            artist: 'AC/DC',
            album: 'Highway to Hell',
            duration: '3:28',
            durationSeconds: 208,
            coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
            liked: true,
          },
          {
            id: 'rock-3',
            title: 'Thunderstruck',
            artist: 'AC/DC',
            album: 'The Razors Edge',
            duration: '4:52',
            durationSeconds: 292,
            coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
            liked: true,
          },
          {
            id: 'rock-4',
            title: 'Sweet Child O\' Mine',
            artist: 'Guns N\' Roses',
            album: 'Appetite for Destruction',
            duration: '5:56',
            durationSeconds: 356,
            coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80',
            liked: true,
          },
          {
            id: 'rock-5',
            title: 'Smoke on the Water',
            artist: 'Deep Purple',
            album: 'Machine Head',
            duration: '5:40',
            durationSeconds: 340,
            coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
            liked: true,
          },
        ],
      },
      {
        id: 'garrido-metal-workout',
        title: 'Heavy Metal & Code',
        subtitle: 'Playlist • Márcio Garrido',
        author: 'Márcio Garrido',
        coverUrl: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&q=80',
        tracksCount: 60,
        tracks: [
          {
            id: 'metal-1',
            title: 'Master of Puppets',
            artist: 'Metallica',
            album: 'Master of Puppets',
            duration: '8:35',
            durationSeconds: 515,
            coverUrl: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&q=80',
            liked: true,
          },
          {
            id: 'metal-2',
            title: 'The Trooper',
            artist: 'Iron Maiden',
            album: 'Piece of Mind',
            duration: '4:11',
            durationSeconds: 251,
            coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80',
            liked: true,
          },
          {
            id: 'metal-3',
            title: 'Paranoid',
            artist: 'Black Sabbath',
            album: 'Paranoid',
            duration: '2:49',
            durationSeconds: 169,
            coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
            liked: true,
          },
          {
            id: 'metal-4',
            title: 'Fear of the Dark',
            artist: 'Iron Maiden',
            album: 'Fear of the Dark',
            duration: '7:18',
            durationSeconds: 438,
            coverUrl: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&q=80',
            liked: true,
          },
        ],
      },
    ],
  },
  {
    id: 'friend-3',
    name: 'Camila',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    currentTrack: 'SaWaDiKa',
    currentArtist: 'Fic',
    lastActive: 'Há 1h',
    playlists: [
      {
        id: 'camila-lofi-beats',
        title: 'Lo-Fi Study Beats',
        subtitle: 'Playlist • Camila',
        author: 'Camila',
        coverUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80',
        tracksCount: 35,
        tracks: [
          {
            id: 'camila-1',
            title: 'SaWaDiKa',
            artist: 'Fic',
            album: 'Oriental Moods',
            duration: '2:40',
            durationSeconds: 160,
            coverUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80',
            liked: false,
          },
          {
            id: 'camila-2',
            title: 'Coffee in Rain',
            artist: 'Chilled Cow',
            album: 'Lofi Sessions',
            duration: '2:12',
            durationSeconds: 132,
            coverUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
            liked: true,
          },
        ],
      },
      {
        id: 'camila-jazz-focus',
        title: 'Jazz para focar',
        subtitle: 'Playlist • Camila',
        author: 'Camila',
        coverUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80',
        tracksCount: 22,
        tracks: [
          {
            id: 'camila-jazz-1',
            title: 'Blue in Green',
            artist: 'Miles Davis',
            album: 'Kind of Blue',
            duration: '5:37',
            durationSeconds: 337,
            coverUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80',
            liked: true,
          },
          {
            id: 'camila-jazz-2',
            title: 'Autumn Leaves',
            artist: 'Bill Evans Trio',
            album: 'Portrait in Jazz',
            duration: '6:02',
            durationSeconds: 362,
            coverUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80',
            liked: false,
          },
        ],
      },
    ],
  },
  {
    id: 'friend-4',
    name: 'Lucas Ferreira',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    currentTrack: 'Evidências',
    currentArtist: 'Chitãozinho & Xororó',
    lastActive: 'Ativado',
    playlists: [
      {
        id: 'lucas-sertanejo',
        title: 'Sertanejo Raiz',
        subtitle: 'Playlist • Lucas Ferreira',
        author: 'Lucas Ferreira',
        coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80',
        tracksCount: 52,
        tracks: [
          {
            id: 'lucas-1',
            title: 'Evidências',
            artist: 'Chitãozinho & Xororó',
            album: 'Cowboy do Asfalto',
            duration: '4:39',
            durationSeconds: 279,
            coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80',
            liked: true,
          },
        ],
      },
      {
        id: 'lucas-modao',
        title: 'Modao de Estrada',
        subtitle: 'Playlist • Lucas Ferreira',
        author: 'Lucas Ferreira',
        coverUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80',
        tracksCount: 31,
        tracks: [
          {
            id: 'lucas-modao-1',
            title: 'Romaria',
            artist: 'Renato Teixeira',
            album: 'Romaria',
            duration: '3:57',
            durationSeconds: 237,
            coverUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80',
            liked: true,
          },
          {
            id: 'lucas-modao-2',
            title: 'Tocando em Frente',
            artist: 'Almir Sater',
            album: 'Tocando em Frente',
            duration: '3:31',
            durationSeconds: 211,
            coverUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80',
            liked: true,
          },
          {
            id: 'lucas-modao-3',
            title: 'Telefone Mudo',
            artist: 'Trio Parada Dura',
            album: 'As Romanticas',
            duration: '3:19',
            durationSeconds: 199,
            coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80',
            liked: false,
          },
        ],
      },
    ],
  },
];

// Mensagens diretas com histórico de conversa completo
export const DIRECT_MESSAGES: DirectMessage[] = [
  {
    id: 'dm-1',
    senderName: 'Mariana Costa',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    previewText: 'compartilhou 1 música',
    date: '8 de abr.',
    messages: [
      {
        id: 'msg-1',
        sender: 'them',
        text: 'E aí Jão! Já ouviu esse som novo?',
        time: '14:20',
      },
      {
        id: 'msg-2',
        sender: 'them',
        text: 'Dá uma olhada, achei muito a sua cara:',
        time: '14:21',
        sharedTrack: CURRENT_TRACK,
      },
      {
        id: 'msg-3',
        sender: 'me',
        text: 'Nossa, bom demais! Já adicionei na minha playlist.',
        time: '14:25',
      },
    ],
  },
  {
    id: 'dm-2',
    senderName: 'Felipe Santos',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80',
    previewText: 'Enviou uma recomendação',
    date: '7 de mar.',
    messages: [
      {
        id: 'msg-201',
        sender: 'them',
        text: 'Mano, aquele álbum do Cazuza que você tava ouvindo é sensacional',
        time: '18:05',
      },
      {
        id: 'msg-202',
        sender: 'me',
        text: 'Exagerado né? Um clássico atemporal!',
        time: '18:10',
      },
    ],
  },
];
