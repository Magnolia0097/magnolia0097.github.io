---
layout: post
title: Tomcat_Linux_Install
---

필요한 linux 버전의 톰캣을 찾아서 tar 혹은 zip 파일을 다운받는 과정은 생략한다

<br>

### 자바 확인

{% highlight linux %}
cd /usr/lib/jvm
안에 있다
{% endhighlight %}
<br>

{% highlight linux %}
원하는 자바 버전을 선택하여 환경설정 
~/.bash_profile 
또는
/etc/profile
(전역환경설정) 둘중 원하는 곳에 설정하자 

1. export JAVA_HOME="경로"
2. JAVA_HOME="경로";
    export JAVA_HOME 

둘중 아무 방식으로 기록
{% endhighlight %}

<br>


환경변수 설정 후에 `source ~/.bash_profile` or `source /etc/profile` 을 통해 저장할 것

또는 원하는 자바 버전을 직접 설치하여도 좋다

<br>


### Tomcat 설치 및 기동

{% highlight cmd %}
tar xvf tomcat6_64bit.tar

cd tomcat/bin
압축 푼 폴더 안쪽에 bin 파일로 이동

 vi catalina.sh
{% endhighlight %}

<br>

catalina.sh 안에 해당 내용 복붙

{% highlight cmd %}
JAVA_HOME="/usr"
JAVA_OPTS="-Xms512m -Xmx512m -XX:PermSize=256m -XX:MaxPermSize=256m -XX:NewSize=256m -Dname=SPACEMON -Dderby.language.sequence.preallocator=1 -XX:-UseParallelGC -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding="UTF-8""
CATALINA_HOME="/home/bmt/tomcat"
TOMCAT_HOME="/home/bmt/tomcat"
{% endhighlight %}

<br>

경로 잘 확인하자, 자신에게 맞게 설정하기

`#` 때문에 주석취급 받지 않게 조심하기

{% highlight cmd %}
cd tomcat/conf

vi server.xml
{% endhighlight %}

<br>

{% highlight xml %}
    <Host appBase="어쩌구저쩌구" autoDeploy="true" name="localhost" unpackWARs="true" xmlNamespaceAware="false" xmlValidation="false">
{% endhighlight %}    
라는 부분이 있을것이다

저 어쩌구 저쩌구라는 부분의 경로를 알아서 잘, 연결하자

웹 개발 폴더인 경우 `WEB-INF` 라는 폴더가 들어 있는 폴더의 경로로 설정해주면 된다
ex) test/Backend/WEB-INF 라면 >> appBase="/test/Backend" 로 해주면 됨 


<br>

{% highlight xml %}
<Connector port="8080" protocol="HTTP/1.1"
    connectionTimeout="20000"
    redirectPort="8443">
{% endhighlight %}

이라는 부분도 있을텐데 포트는 `8080` 이 아닌 임의로 정해도 상관없다

다만 서버를 실행한 호스트 외에 외부 호스트에서 접속 시 포트 개방을 안한 상태라면 접속이
차단 될 수 있다

[외부포트개방법](/2023/07/19/linux-firewall) 링크 참고

<br>

기동

{% highlight cmd %}
cd tomcat/bin

./startup.sh
기동

ps -ef | grep tomcat
기동 확인
{% endhighlight %}

<br>
