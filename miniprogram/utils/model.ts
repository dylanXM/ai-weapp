import { ModelData, ModelOption } from "miniprogram/api/model/type";

interface ChooseModel {
  model: string;
  modelName: string;
  keyType: number;
}

const defaultConfig = {
  maxModelTokens: 4096,
  maxResponseTokens: 2000,
  systemMessage: '',
  topN:0.8,
  rounds:8
};

export const ModelsMapDesc = (key: number, deductType: number, deduct: number) => {
  const desc = {
    1: {
      1: `系统内置模型：支持智能对话，速度更快，每次消耗基础模型 ${deduct} 积分`,
      2: `系统内置模型：拥有更强的推理能力，每次消耗高级模型 ${deduct} 积分`
    },
    2: {
      1: `百度千帆大模型：每次消耗基础模型 ${deduct} 积分`,
      2: `百度千帆大模型：每次消耗高级模型 ${deduct} 积分`,
    },
    3: {
      1: `清华智谱大模型：每次消耗基础模型 ${deduct} 积分`,
      2: `清华智谱大模型：每次消耗高级模型 ${deduct} 积分`,
    },
    4: {
      1: `系统模型：每次消耗基础模型 ${deduct} 积分`,
      2: `系统模型：每次消耗高级模型 ${deduct} 积分`,
    },
    5: {
      1: `联网模型：支持联网查询总结，每次消耗基础模型 ${deduct} 积分`,
      2: `联网模型：支持联网查询总结，每次消耗高级模型 ${deduct} 积分`,
    },
    6: {
      1: `全能模型：支持联网查询总结、绘画，每次消耗基础模型 ${deduct} 积分`,
      2: `全能模型：支持联网查询总结、绘画，每次消耗高级模型 ${deduct} 积分`,
    }
  };
  return desc[key][deductType];
};

export const formatModelOptions = (modelMaps: ModelData['modelMaps'], chooseModel: ChooseModel) => {
  const options: any[] = [];
  const modelTypes = Object.keys(modelMaps || {});
  modelTypes.forEach(key => {
    const modelList = modelMaps[Number(key)];
    modelList.forEach(_model => {
      const { modelName, model, deductType, deduct } = _model;
      const isCurrentModel = model === chooseModel.model && modelName === chooseModel.modelName;
      const option = {
        name: modelName,
        // subname: `基于模型${model}训练，每次消耗${deductType === 1 ? '基础' : '高级'}模型 ${deduct} 积分`,
        subname: ModelsMapDesc(key, deductType, deduct),
        ..._model,
        color: isCurrentModel ? '#07c160' : '#323233',
        className: isCurrentModel ? 'p-chat-model-active-item' : '',
      };
      options.push(option);
    });
  });
  return options;
};

export const getChooseModel = (
  modelMaps: ModelData['modelMaps'],
  chooseModel: { model: string; modelName: string }
): ChooseModel => {
  let newModel = {} as ChooseModel;
  const modelTypes = Object.keys(modelMaps);
  modelTypes.forEach(key => {
    const modelList = modelMaps[Number(key)];
    modelList.forEach(_model => {
      const { modelName, model } = _model;
      const isCurrentModel = model === chooseModel.model && modelName === chooseModel.modelName;
      if (isCurrentModel) {
        newModel = { ...defaultConfig, ..._model, keyType: Number(key) };
      }
    });
  });
  return newModel;
};

export const getChooseModelInfo = (
  modelTypeList: ModelData['modelTypeList'],
  keyType: string,
): ModelOption => {
  const modelOption = modelTypeList.find(model => model.val === keyType);
  if (!modelOption) {
    return {} as ModelOption;
  }
  return modelOption;
}