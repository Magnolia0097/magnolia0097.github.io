---
layout: post
title: Linux_firewall_setting
---

<br>

### 방화벽 포트 개방

{% highlight linux %}
firewall-cmd --state

firewall-cmd --add-port=포트번호/통신방식 --permanent
ex) firewall-cmd --add-port=22/tcp --permanent

firewall-cmd --reload
적용

firewall-cmd --zone=public --list-all 
적용 확인
{% endhighlight %}

<br>
<br>
<br>
