export function formatMyPreset(minePreset: any) {
  const { appDes, appName, appId } = minePreset;
  return { ...minePreset, name: appName, des: appDes, public: false, id: appId };
}