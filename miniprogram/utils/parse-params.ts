type ParseType = 'image' | 'file';

const parseTypeMap = (url: string) => ({
  image: {
    messagesHistory: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url
            }
          },
          {
            type: 'text',
            text: '图像描述了什么？'
          }
        ]
      }
    ]
  },
  file: {
    messagesHistory: [
      {
        role: 'user',
        content: [
          {
            type: 'file',
            file_url: {
              url
            }
          },
          {
            type: 'text',
            text: '文档里说了什么？'
          }
        ]
      }
    ],
  }
});

export function parseParams(type: ParseType, url: string) {
  return parseTypeMap(url)[type];
}