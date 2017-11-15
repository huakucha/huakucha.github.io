---
layout: post
title: "Python计算Dex头中的checksum和signature"
date: 2017-11-15 12:33:36 +0800
comments: true
tags: [Android, Python, Dex]
description: "Python计算Dex头中的checksum和signature"
categories: [Android]
---
#前言
本文主要编写修改Android程序DEX头中checksum、signature 和file_size头信息的Python脚本，修改checksum、signature的场景一般出现在加壳以及逆向之后重签名之后对文件完整性进行修改

<!--more-->

我们先看一下文件头记录了dex文件的一些基本信息 : 

```python
magic     : dex魔术字, 固定信息: dex\n035
checksum  : alder32算法, 去除了magic和checksum字段之外的所有内容的校验码
signature : sha-1签名, 去除了magic、checksum和signature字段之外的所有内容的签名
fileSize  : 整个dex的文件大小
headerSize: 整个dex文件头的大小 (固定大小为0x70)
endianTag : 字节序 (大尾方式、小尾方式)默认为小尾方式 <--> 0x12345678
```
###首先导入修改Dex所需要的python库

```python
import os,sys
import zlib,hashlib
import struct
```

###Checksum
`Dex`文件头中的`checksum`是用来校验文件的完整性，使用`adler32`算法。在`python`中的`zlib`库中有该算法

```python
def repairChecksum(self):
	self.seek(8)
	sourceData = self.read(4)
	self.seek(12)
	checkdata = self.read()
	checksum = zlib.adler32(checkdata)
	checkInt = checksum & 0xffffffff
	bytes = struct.pack('i',checksum)
	print "头部原checksum:",sourceData
	print "计算checksum:",checkInt
	
	if bytes == sourceData:
		print 'checksum效验正常'
	else:
		print 'checksum效验异常'
		file_object.seek(8)
		file_object.write(bytes)
		#byte1 = struct.unpack('i',byte0)
		print 'checksum修复成功'
```

###Signature
`Dex`头中的`Signature`是对`dex`文件的签名，签名`signature`字段之后的数据（32字节之后），在`hashlib`中有该算法

```python
def repairSignature(self):
	#4 + 4 + 4 + 20
	self.seek(12)
	sourceData = self.read(20)
	self.seek(32)
	sigdata = self.read()
	sha1 = hashlib.sha1()
	sha1.update(sigdata)
	sha0 = sha1.hexdigest()
	sha2 = sha1.digest()
	print "signature:",sha0
	print "现signature:",sha2
	print "原signature:",sourceData
	
	if sourceData == sha2:
        print 'SHA1效验正常'
    else:
        print 'SHA1效验异常
        for i in xrange(len(sha2)):    
            salt = sha2[i] 
            file_object.seek(i)
            bytes = struct.pack('c',salt)
            file_object.write(bytes)
        
        print 'SHA1效验修复成功'
```
我在方法中加入了效验跟修复功能，为了方便查看，使用010 Editor打开刚刚生成的Dex文件，在官网下载一个Dex模板的脚本，然后运行修改之后可以用此python做完整性效验修复...

#参考资料
* http://blog.csdn.net/feglass/article/details/51761902
* http://www.sweetscape.com/010editor/repository/templates/file_info.php?file=DEX.bt