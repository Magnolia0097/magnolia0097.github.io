---
layout: post
title: Linux_SELinux 비활성화
---

<br>

### SELinux 비활성화

{% highlight linux %}
su - root
vi /etc/selinux/config

SELINUX=disabled
해당 값으로 변경하여 영구 비활성

reboot
이곳에서 수정
{% endhighlight %}

<br>
<br>
<br>
