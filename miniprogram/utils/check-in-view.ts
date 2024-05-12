function checkInView(page: any) {
  // 创建节点查询器
  const query = page.createSelectorQuery();
  
  // 选择需要检查的view元素，这里以id为例
  query.select('#your-view-id').boundingClientRect();
  
  // 执行查询
  query.exec((res) => {
    // res[0] 是查询到的第一个节点的信息
    if (res[0]) {
      const rect = res[0];
      // 获取页面滚动位置
      wx.pageScrollTo({
        scrollTop: 0, // 滚动到顶部
        duration: 0,  // 不需要动画
        success: function(res) {
          // 检查元素是否在视图范围内
          if (rect.top >= 0 && rect.bottom <= page.windowHeight) {
            console.log('元素在视野范围内');
          } else {
            console.log('元素不在视野范围内');
          }
        }
      });
    }
  });
}