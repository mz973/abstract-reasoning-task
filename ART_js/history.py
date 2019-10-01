#The command used to regenerate test images from original set
P=[]
import numpy as np
import glob
p2=[]
from glob import glob
from PIL import Image
for n in range(80):
    pattern1 = '/Users/mz01/Desktop/jatos-3.3.1_win_java/study_assets_root/ac_stm_training/ART_js/images/tf1/*_%d_*T*pd*' %(n+1)
    pattern2 = '/Users/mz01/Desktop/jatos-3.3.1_win_java/study_assets_root/ac_stm_training/ART_js/images/tf1/*_%d_*T*md*' %(n+1)
    files1=glob(pattern1)
    files2=glob(pattern2)
    files1=np.array(files1)
    files2=np.array(files2)
    p=np.random.permutation(len(files1))
    P.append(p)
    files1=files1[p]
    files2=files2[p]
    images1 = map(Image.open, files1)
    images2 = map(Image.open, files2)
    images1=[ImageOps.expand(x,border=1,fill='grey') for x in images1]
    images2=[ImageOps.expand(x,border=1,fill='grey') for x in images2]
    widths, heights = zip(*(i.size for i in images1))

    total_width = sum(widths)
    max_height = max(heights)

    new_im1 = Image.new('RGB', (total_width, max_height))
    new_im2 = Image.new('RGB', (total_width, max_height))

    x_offset = 0
    for im in range(len(images1)):
        new_im1.paste(images1[im], (x_offset,0))
        new_im2.paste(images2[im], (x_offset,0))
        x_offset += images1[im].size[0]
    new_dr1 = '/Users/mz01/Desktop/jatos-3.3.1_win_java/study_assets_root/ac_stm_training/ART_js/images/tf1/bottom_%d_pd.jpeg' %(n+1)
    new_dr2 = '/Users/mz01/Desktop/jatos-3.3.1_win_java/study_assets_root/ac_stm_training/ART_js/images/tf1/bottom_%d_md.jpeg' %(n+1)
    new_im1.save(new_dr1)
    new_im2.save(new_dr2)
P
ans=[np.where(P[x]==0)[0] for x in range(80)]
ans
ans=[ans[x][0] for x in range(80)]
ans
%history -f /Users/mz01/Desktop/jatos-3.3.1_win_java/study_assets_root/ac_stm_training/ART_js/history.py
