export interface ChatGroup {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  userId: number;
  isSticky: boolean;
  title: string;
  appId?: string;
  isDelete: boolean;
  config: string;
}

export interface RequestOption {
	options?: any;
	prompt: string;
}

export interface Message {
  id?: string;
	chatId?: number;
	dateTime: string;
	text: string;
	inversion: boolean;
  error: boolean;
  usage?: number;
  loading?: boolean;
	conversationOptions?: any;
  requestOptions: RequestOption;
  originText?: string;
}