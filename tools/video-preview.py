import imageio_ffmpeg as ff,pathlib,subprocess
video=pathlib.Path('.private-sources/files/1-5UmMTavS66pWuID4h4OTRT-UK8MJIkV.mp4')
exe=ff.get_ffmpeg_exe();dest=pathlib.Path('.private-sources/pronunciations-frame.jpg')
subprocess.run([exe,'-y','-ss','1','-i',str(video),'-frames:v','1',str(dest)],capture_output=True,check=True)
subprocess.run([exe,'-y','-i',str(video),'-vn','-ac','1','-ar','16000','-b:a','48k','.private-sources/pronunciations.mp3'],capture_output=True,check=True)
print(subprocess.run([exe,'-i',str(video)],capture_output=True,text=True).stderr[-1700:])
