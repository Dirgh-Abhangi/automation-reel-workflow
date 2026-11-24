"""Render consistent views and expression poses from the generated Blender file."""
import bpy,sys,argparse,math
from pathlib import Path
from mathutils import Vector
p=argparse.ArgumentParser();p.add_argument('--scene',required=True);p.add_argument('--out',required=True);p.add_argument('--only',default='');a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=a.scene);scene=bpy.context.scene;cam=scene.camera
root=bpy.data.objects['adult_a'];target=root.location+Vector((0,0,1.15));scene.render.resolution_x=600;scene.render.resolution_y=800;scene.render.resolution_percentage=100;scene.cycles.samples=48
# Hide other characters, leaving set and lighting intact.
for o in scene.objects:
 t=o
 while t.parent:t=t.parent
 if t.name in ['adult_b','older','child']:o.hide_render=True
for name,yaw,frame,close in [('front',0,1,False),('side',90,1,False),('back',180,1,False),('three_quarter',35,1,False),('neutral',0,1,True),('surprised',0,44,True),('tense',0,66,True),('return',0,90,True),('wave',35,42,False)]:
 if a.only and name not in a.only.split(','):continue
 for obj in scene.objects:
  top=obj
  while top.parent:top=top.parent
  if top.type in ['MESH','FONT'] and not top.name.startswith('floorboard'):obj.hide_render=(name=='back')
 scene.frame_set(frame);aim=target+Vector((0,0,.73 if close else 0));angle=math.radians(yaw);cam.location=aim+Vector((math.sin(angle)*6,-math.cos(angle)*6,.2));cam.rotation_euler=(aim-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=1.05 if close else 2.85;scene.render.filepath=str(out/(name+'.png'));bpy.ops.render.render(write_still=True)
