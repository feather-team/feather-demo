Template
================

超轻量级的前端模版引擎

###使用
```html
<script>
Template.parse("<%if(status){%>true<%}else{%>false<%}%>", {status: 1});

Template.fetch("test", {
  list: [
    {
      name: '123'
    },
    
    {
      name: '123'
    }
  ]
});
</script>

<script type="text/html" id="test">
<%list.forEach(function(item){%>
<p><%=item.name%></p>
<%});%>
</script>
```
