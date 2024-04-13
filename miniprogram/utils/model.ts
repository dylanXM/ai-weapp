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
        subname: `基于模型${model}训练，每次消耗${deductType === 1 ? '基础' : '高级'}模型 ${deduct} 积分`,
        ..._model,
        color: isCurrentModel ? '#1989fa' : '#323233',
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