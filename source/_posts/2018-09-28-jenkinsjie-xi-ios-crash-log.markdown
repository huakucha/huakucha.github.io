---
layout: post
title: "Jenkins解析IOS Crash Log"
date: 2018-09-28 12:01:26 +0800
comments: true
categories: IOS
---
#前言

其实市面上已经有很多崩溃收集平台上了bugly、fabric等，但也会有少量的Crash log是以测试人员提供，这些日志log一般是从手机通过Xcode导出,当我们从设备中导出日志时，调用栈是一串地址，并不能看懂，此时所需的是对其进行符号化（symbolicate）,然而像低内存导致的 crash，那么是没有调用栈的，这部分应该在收到内存警告的时候进行处理
<!--more-->

#Crash 日志生成步骤
通过官方文档，来看看生成步骤
![上图为plist文件数据](/images/2018/ios_crash_flow.png)

如果想深入了解Crash 符号化的相关内容文末会给出相关链接,扫盲部分本文就不在重复了,本文的重点是提供Jenkins解析IOS Crash Log的一段Python脚本对log文件进行符号化(部分符号化、未符号化--->完全符号化 的过程)


```Python
import re
import sys, getopt
import commands
import os

#获取UUID
def getUUID(text):
    uuid = re.findall('<(.*)>',text)[0].upper()
    UUID = uuid[0:8] + '-' + uuid[8:12] +'-' + uuid[12:16] +'-' +uuid[16:20] + "-" + uuid[20:32]
    return UUID

def analyzeCrashLog(inputfile,outputfile):
    #1
    crashlog = commands.getoutput('grep --after-context=1000 "Binary Images:" ' + inputfile + '  | grep "XXXXX arm"')
    #2
    uuid = getUUID(crashlog)
    #3
    path = commands.getoutput('mdfind "com_apple_xcode_dsym_uuids == " '+ uuid)
    path = path + '/dSYMs/xxxxx.app.dSYM'
    path = "'"+path+"'"
    #4
    ttt = commands.getoutput('/Users/iOS_Team/CrashAnalysis/symbolicatecrash '+ inputfile +' -d '+ path +' -o xxxx-IOS-Crash.crash')
    print ttt

def main(argv):
    inputfile = ''
    outputfile = ''
    try:
        opts, args = getopt.getopt(argv,"hi:o:",["ifile=","ofile="])
    except getopt.GetoptError:
      sys.exit(2)
   
    for opt, arg in opts:
      if opt == '-h':
         sys.exit()
      elif opt in ("-i", "--ifile"):
         inputfile = arg
      elif opt in ("-o", "--ofile"):
         outputfile = arg
    analyzeCrashLog(inputfile,outputfile)

if __name__ == "__main__":
   main(sys.argv[1:])
   
```

上述过程除去加载log文件大概四步(内部的xxxx一般是工程名相关，自行更改解析)

* 1、找到包含 Binary Image Name 对应的二进制 UUID
* 2、解析UUID并格式化
* 3、执行mdfind命令找到打包机打包产生的符号表文件位置
* 4、symbolicatecrash符号化log文件并输出至指定文件

#最后
###相关链接
* http://saitjr.com/ios/symbolicatecrash-1.html
* http://saitjr.com/ios/symbolicatecrash-2.html
* http://saitjr.com/ios/symbolicatecrash-3.html