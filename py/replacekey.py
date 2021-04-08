# APIキーをGithubに上げたくないので削除、設定する
# 実際のAPIキーはkeys.jsonに記述する
import sys
import os
import argparse
import glob
import json


API_KEY_MINE = 'mine'
API_KEY_HIDE = "YOUR_API_KEY"

this_file = sys.argv[0]

parser = argparse.ArgumentParser(description="your true API key change/unchange to YOUR_API_KEY")
parser.add_argument('-m','--mode',help="set = change YOUR_API_KEY to true key, hide = change true key to YOUR_API_KEY",choices=['set','hide'],default='set')
parser.add_argument('-k','--key',help="set the name in keys.json. default = mine",default=API_KEY_MINE)
parser.add_argument('-p','--path',help="set the path of your file.defaut = ./*.html",default='./*.html')
parser.add_argument('-j','--json',help='set the path of settign file. default = keys.json')

args = parser.parse_args()
if args.json == None:
    json_file = os.path.join(os.path.dirname(this_file),'keys.json')
else:
    json_file = parser.json
json_open = open(json_file)
json_load = json.load(json_open)

key = json_load[args.key]

print(args.mode)
files = glob.glob(args.path)
for file in files:
    print(file)
    with open(file,'r') as f:
        fileText = f.read()
    if args.mode == 'set':
        fileText=fileText.replace(API_KEY_HIDE,key)
    else:
        for k in json_load.keys():
            fileText=fileText.replace(json_load[k],API_KEY_HIDE)
    with open(file,'w')as f:
        f.write(fileText)
        f.close()
        
