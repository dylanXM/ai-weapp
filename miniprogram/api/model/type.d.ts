export interface ModelOption {
	label: string;
	val: string;
}

export interface ModelType {
	modelName: string;
	model: string;
	deduct: number;
	deductType: number;
	maxRounds: number;
}

export interface ModelMap {
	[key: number]: ModelType[];
}

export interface ModelData {
	modelTypeList: ModelOption[];
	modelMaps: ModelMap;
}

export interface ModelInfo {
	keyType: number;
	modelName: string;
	model: string;
	maxModelTokens: number;
	maxResponseTokens: number;
	topN: number;
	systemMessage: string;
	deductType: number;
	deduct: number;
	maxRounds: number;
	rounds: number;
}

export interface BaseModelData {
  modelTypeInfo: ModelOption;
  modelInfo: ModelInfo;
}