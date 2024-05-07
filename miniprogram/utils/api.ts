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
  const header: { Authorization?: string; Accept: string } = {
    Accept: 'application/json;charset=UTF-8',
  };
  if (token) {
    header.Authorization = `Bearer ${wx.getStorageSync('token')}`;
  }
  return new Promise((resolve, reject) => {
    try {
      wx.request({
        ...params,
        header,
        success: res => {
          if (res.statusCode === 200) {
            resolve(res?.data as unknown as IRes<T>)
          } else {
            reject(res.data);
          }
        },
        fail: err => reject(err), 
      });
    } catch (err) {
      reject(err);
    }
  });
};

export default request;