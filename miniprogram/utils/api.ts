interface IParams {
  url: string;
  data: any;
  method: 'POST' | 'GET';  
}

interface IRes<T> {
  code: number;
  data: T;
  message: string;
  success: boolean;
}

const request = async <T>(params: IParams): Promise<IRes<T>> => {
  const token = wx.getStorageSync('token');
  const header: { Authorization?: string } = {};
  if (token) {
    header.Authorization = `Bearer ${wx.getStorageSync('token')}`;
  }
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header,
      success: res => resolve(res?.data as unknown as IRes<T>),
      fail: error => reject(error), 
    });
  });
};

export default request;