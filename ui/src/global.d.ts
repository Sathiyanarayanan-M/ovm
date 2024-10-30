interface HeightWidth {
  height: number | string;
  width: number | string;
}

// Page Types

// Player Types
interface PlayerState {
  name: string;
  avatar: string;
  id?: string;
  points: number;
}

// Game Types

// HOME_SCREEN:  Indicates that the user is on the main screen.
// LOBBY_WAITING: User is in the lobby and waiting for the game to start.
// IN_GAME: Game is currently being played.
// GAME_OVER:  Indicates that the game has ended.
type GameStatus = "HOME_SCREEN" | "LOBBY_WAITING" | "IN_GAME" | "GAME_OVER";
type RoundStatus = "CHOOSING_WORD" | "DRAWING";

interface GameState extends FinalGameState {
  players: PlayerState[];
  roomId: string;
  gameStatus: GameStatus;
  admin: string;
  duration: number;
}

interface RoomState
  extends Pick<
    GameState & SettingsState,
    "admin" | "duration" | "language" | "rounds"
  > {
  id: string;
  status: GameStatus;
}

interface SettingsState {
  language: string;
  duration: number;
  rounds: number;
}

interface FinalGameState {
  rounds: number;
  // startTime: string;
  // endTime: string;
  language: string;
}

interface RoundsState {
  roundNo: number;
  artist: string;
  hasChosen: boolean;
  roundStatus: RoundStatus;
}

// CanvasType

type CanvasMouseHandler = React.MouseEvent<HTMLCanvasElement, MouseEvent>;
type ToolsType = "pen" | "eraser";

// API Payload

interface CreateRoomPayload extends PlayerState {}
interface JoinRoomPayload extends PlayerState {
  room_id: GameState["roomId"];
}

// API Response

interface APIResp<T = any> {
  error: boolean;
  message: string;
  data: T;
}

interface CreateRoomResponse {
  player: PlayerState & {
    id: number;
  };
  room: RoomState;
}

interface JoinRoomResponse extends CreateRoomResponse {}

interface SelectWordsResponse {
  name: string;
  count: string;
}

type JoinRoomSocketResp = {
  currentPlayer: PlayerState;
  players: PlayerState[];
  room: RoomState;
};

type StartGameSocketResp = {
  end_time: string;
  start_time: string;
  id: string;
  admin: GameState["admin"];
  status: GameStatus;
  artist: string;
  round_no: number;
} & SettingsState;

type OnMessageSocketResp = {
  player_id: string;
  word: string;
};

type GameOverResp = {
  id: string;
  points: number;
}[];

type NextPlayerSocketResp = {
  id: string;
  artist: string;
  round_no: number;
};

// cr - Start or Finish
type DrawingData = { offsetX: number; offsetY: number; cr: "s" | "d" | "f" };

