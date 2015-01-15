Alert
================

##简介
实现windows原生的一些弹窗警告之类的组件

##API
* Alert.alert(content);

* Alert.confirm(content[, callback, unclose]);

  同windows.confirm，callback为按下确定按钮触发的时间， unclose为是否关闭，可手动关闭用于ajax请求之类的。
