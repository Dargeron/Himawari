import getpass,json,os,subprocess,sys,urllib.request,urllib.error
token=getpass.getpass('Cloudflare token (hidden): ')
if sys.argv[1]=='check':
    for endpoint in ['user/tokens/verify','accounts/92738697b564d5b7dacbfed8c16aded3/workers/services']:
        request=urllib.request.Request('https://api.cloudflare.com/client/v4/'+endpoint,headers={'Authorization':'Bearer '+token})
        try:
            with urllib.request.urlopen(request,timeout=30) as response:
                data=json.load(response)
                print(json.dumps({'endpoint':endpoint,'success':data.get('success'),'status':data.get('result',{}).get('status') if isinstance(data.get('result'),dict) else None,'services':[r.get('id') for r in data.get('result',[]) ] if isinstance(data.get('result'),list) else None}))
        except urllib.error.HTTPError as error:
            print(json.dumps({'endpoint':endpoint,'status':error.code,'error':json.loads(error.read()).get('errors')}))
else:
    env=dict(os.environ,CLOUDFLARE_API_TOKEN=token,WRANGLER_SEND_METRICS='false')
    result=subprocess.run(['node','node_modules/wrangler/bin/wrangler.js','deploy','--config',sys.argv[1]],env=env)
    sys.exit(result.returncode)
