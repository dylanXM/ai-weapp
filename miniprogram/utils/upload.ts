import config from '../const/config/index';

export async function uploadFile(filePath: string) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${config.url}/upload/file`,
      // url: 'http://43.138.202.234:9520/api/upload/file',
      filePath: filePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
      },
      success(res) {
        resolve(res);
      },
      fail: function(err) {
        console.error(err);
        wx.showToast({ title: '图片上传失败', icon: 'error' });
        reject();
      }
    });
  });
}