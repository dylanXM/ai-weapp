import { ModelData } from "miniprogram/api/model/type";

interface ChooseModel {
  model: string;
  modelName: string;
}

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
        newModel = _model;
      }
    });
  });
  return newModel;
};