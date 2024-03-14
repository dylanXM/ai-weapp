export interface GetWechatSessionReq {
  code: string;
}

export interface GetWechatSessionRes {
  openId: string;
  sessionKey: string;
}

export interface UserInfo {
	username: string;
	email: string;
	avatar: string;
	sign: string;
	inviteCode: string;
	role: string;
	consecutiveDays: number;
	isBindWx: boolean;
}

export interface UserBalance {
	model3Count: number;
	model4Count: number;
	drawMjCount: number;
	packageId: number;
	memberModel3Count: number;
	memberModel4Count: number;
	memberDrawMjCount: number;
	useModel3Count: number;
	useModel4Count?: number;
	useModel3Token: number;
	useModel4Token?: number;
	useDrawMjToken: number;
	expirationTime?: number;
	sumModel3Count: number;
	sumModel4Count: number;
	sumDrawMjCount: number;
}

export interface UserData {
	userInfo: UserInfo;
	userBalance: UserBalance;
}