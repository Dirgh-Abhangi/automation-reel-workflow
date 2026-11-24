"""Deterministic walk/reach/lift proof. Run with Blender; see FOUNDATION.md."""
import argparse, json, math, sys
from pathlib import Path
import bpy
from mathutils import Vector

p=argparse.ArgumentParser()
p.add_argument('--scene',required=True);p.add_argument('--out',required=True)
p.add_argument('--character',default='adult_a');p.add_argument('--render',action='store_true')
p.add_argument('--frames',default='');p.add_argument('--samples',type=int,default=8)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);out=Path(a.out).resolve();out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=a.scene)
scene=bpy.context.scene;root=bpy.data.objects[a.character];scale=root.scale.x
if max(root.scale)-min(root.scale)>1e-6 or scale<=0:raise ValueError('Uniform positive character scale required')
# Remove the previous study's animation, retain selected identity/materials.
for o in list(scene.objects):
 o.animation_data_clear()
 top=o
 while top.parent:top=top.parent
 if top.type=='EMPTY' and top!=root:o.hide_render=True
 if o.type=='FONT':o.hide_render=True
root.location=(0,.6*scale,-.05-.0025*scale)
hips=bpy.data.objects[a.character+'/hips'];torso=bpy.data.objects[a.character+'/torso'];torso.rotation_euler=(0,0,0)
head=bpy.data.objects[a.character+'/head'];head.rotation_euler=(0,0,0)
# Restore neutral face from keyframe-one geometry values.
for o in head.children:
 if o.name.startswith('eye') and not o.name.startswith('eye highlight'):o.scale.z=.058
 if o.name.startswith('open mouth'):o.scale=(.000055,.009,.000072)
 if o.name.startswith('smile'):o.scale=(.999001,1,.999001)
 if o.name.startswith('brow'):o.rotation_euler.y=(-1 if o.location.x<0 else 1)*-.12
bpy.context.view_layer.update()

def empty(name):
 o=bpy.data.objects.new(name,None);scene.collection.objects.link(o);return o

def box(name,size,material,parent=None,offset=(0,0,0)):
 bpy.ops.mesh.primitive_cube_add(size=1);o=bpy.context.object;o.name=name;o.dimensions=size
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 o.data.materials.append(material);o.parent=parent;o.location=offset
 b=o.modifiers.new('edge','BEVEL');b.width=.018*scale;b.segments=2
 return o

previous_rotations={}
def key(o,frame):
 if o.name in previous_rotations and o.rotation_quaternion.dot(previous_rotations[o.name])<0:o.rotation_quaternion.negate()
 previous_rotations[o.name]=o.rotation_quaternion.copy()
 o.keyframe_insert('location',frame=frame);o.keyframe_insert('rotation_quaternion',frame=frame)

def segment(o,start,end,frame):
 o.location=start;o.rotation_mode='QUATERNION';o.rotation_quaternion=Vector((0,0,-1)).rotation_difference((Vector(end)-Vector(start)).normalized());key(o,frame)

def smooth(t):
 t=max(0,min(1,t));return t*t*(3-2*t)

def two_bone(start,end,l1,l2,pole):
 """Analytic two-link solve. Reject unreachable targets instead of stretching."""
 start,end=Vector(start),Vector(end);v=end-start;d=v.length
 if not abs(l1-l2)+1e-6<d<l1+l2-1e-6:raise ValueError('unreachable two-bone target')
 axis=v/d;bend=Vector(pole)-axis*Vector(pole).dot(axis);bend.normalize()
 along=(l1*l1-l2*l2+d*d)/(2*d)
 return start+axis*along+bend*math.sqrt(max(0,l1*l1-along*along))

# Split the original rigid legs into upper/lower segments with stable foot targets.
legs={}
for label,sign in [('L',-1),('R',1)]:
 old=bpy.data.objects[a.character+'/leg_'+label]
 for o in list(old.children):bpy.data.objects.remove(o,do_unlink=True)
 bpy.data.objects.remove(old,do_unlink=True)
 upper=empty(a.character+'/thigh_'+label);lower=empty(a.character+'/shin_'+label);foot=empty(a.character+'/ankle_'+label)
 for ob,length in [(upper,.4),(lower,.4)]:box('trouser segment',(.30*scale,.34*scale,length*scale),bpy.data.materials['ink'],ob,(0,0,-length*scale/2))
 box('shoe',(.34*scale,.49*scale,.15*scale),bpy.data.materials['ink'],foot,(0,-.065*scale,-.065*scale))
 box('sole',(.35*scale,.5*scale,.035*scale),bpy.data.materials['warm ivory'],foot,(0,-.065*scale,-.145*scale))
 legs[label]=(upper,lower,foot,sign)
# Detach right arm pivots for world-space analytic IK. Geometry retains its local offsets.
shoulder=bpy.data.objects[a.character+'/shoulder_R'];elbow=bpy.data.objects[a.character+'/elbow_R'];hand=bpy.data.objects[a.character+'/hand_R']
for o in [shoulder,elbow,hand]:
 world=o.matrix_world.copy();o.parent=None;o.matrix_world=world;o.rotation_mode='QUATERNION'
# A visible handleless cube makes the grasp/contact location unambiguous.
material=bpy.data.materials.new('prop coral');material.diffuse_color=(.65,.12,.045,1)
prop=box('pickup cube',(.16*scale,)*3,material);prop.rotation_mode='QUATERNION'
rest=Vector((.49*scale,-.64*scale,.95*scale-.05))
stand=box('prop stand',(.42*scale,.38*scale,.78*scale),bpy.data.materials['walnut']);stand.location=(rest.x,rest.y,-.05+.39*scale)
# Cube bottom at .87*scale-.05; stand top .78*scale-.05: add presentation plinth.
plinth=box('stand top',(.46*scale,.42*scale,.09*scale),bpy.data.materials['brushed brass']);plinth.location=(rest.x,rest.y,-.05+.825*scale)
scene.frame_start=1;scene.frame_end=180;scene.render.fps=30
cam=scene.camera;cam.data.type='PERSP';cam.data.lens=48
scene.render.engine='CYCLES';scene.cycles.samples=a.samples;scene.cycles.use_denoising=False
scene.render.resolution_x=270;scene.render.resolution_y=480;scene.render.resolution_percentage=100
metrics={'max_stance_slip':0.,'max_ground_penetration':0.,'max_grip_error':0.,'max_link_length_error':0.}
last={}
# (start,end,new landing y); all positions scale with the selected character.
steps={'L':[(12,30,.24),(48,66,-.12)],'R':[(30,48,.06),(66,84,-.12)]}
for frame in range(1,181):
 scene.frame_set(frame)
 root.location.y=scale*(.6-.72*smooth((frame-1)/89));root.keyframe_insert('location',frame=frame)
 hips.location.z=.93+.008*math.sin(math.pi*min(1,(frame-1)/89))**2;hips.keyframe_insert('location',frame=frame)
 bpy.context.view_layer.update()
 for label,(upper,lower,foot,sign) in legs.items():
  y=.6;z=0;stance=True
  for start,end,landing in steps[label]:
   if frame>=end:y=landing
   elif frame>start:
    t=(frame-start)/(end-start);y=y+(landing-y)*smooth(t);z=.12*math.sin(math.pi*t)**2;stance=False;break
   else:break
  ankle=Vector((sign*.19*scale,y*scale,-.05+(.1625+z)*scale))
  hip=hips.matrix_world@Vector((sign*.19,0,0));knee=two_bone(hip,ankle,.4*scale,.4*scale,(0,-1,0))
  segment(upper,hip,knee,frame);segment(lower,knee,ankle,frame)
  foot.location=ankle;foot.rotation_mode='QUATERNION';foot.rotation_quaternion=(1,0,0,0);key(foot,frame)
  if stance and label in last and last[label][1]:metrics['max_stance_slip']=max(metrics['max_stance_slip'],(ankle-last[label][0]).length)
  last[label]=(ankle.copy(),stance)
  metrics['max_ground_penetration']=max(metrics['max_ground_penetration'],max(0,-.05-(ankle.z-.1625*scale)))
  metrics['max_link_length_error']=max(metrics['max_link_length_error'],abs((hip-knee).length-.4*scale),abs((knee-ankle).length-.4*scale))
 # Arm swing while walking, settle, reach, then rigid grip and lift.
 start=torso.matrix_world@Vector((.49,0,.7))
 idle=start+Vector((0,-.06*scale,-.70*scale))
 if frame<90:idle.y+=.09*scale*math.sin((frame-1)*math.pi/18)*math.sin(math.pi*(frame-1)/89)
 lift=smooth((frame-125)/35)
 prop.location=rest+Vector((0,.16*scale*lift,.25*scale*lift));key(prop,frame)
 # Palm front surface is y=-.16 relative to wrist; cube rear is y=+.08.
 grip=prop.location+Vector((0,.24*scale,.035*scale))
 target=idle.lerp(grip,smooth((frame-95)/25)) if frame<120 else grip
 bend=two_bone(start,target,.43*scale,.31*scale,(1,0,0))
 segment(shoulder,start,bend,frame);segment(elbow,bend,target,frame)
 hand.location=target;hand.rotation_quaternion=(1,0,0,0);key(hand,frame)
 if frame>=120:
  palm=hand.location+Vector((0,-.16*scale,-.035*scale));contact=prop.location+Vector((0,.08*scale,0));metrics['max_grip_error']=max(metrics['max_grip_error'],(palm-contact).length)
 # Left arm counter-swing, scaled down to settle at arrival.
 left=bpy.data.objects[a.character+'/shoulder_L'];left.rotation_euler=(.18*math.sin((frame-1)*math.pi/18)*math.sin(math.pi*min(1,(frame-1)/89)),0,0);left.keyframe_insert('rotation_euler',frame=frame)
 if frame<=90:
  aim=Vector((0,root.location.y-.05*scale,.98*scale));cam.location=aim+Vector((2.5*scale,-4.5*scale,1.3*scale))
 else:
  t=smooth((frame-91)/89);aim=Vector((.18*scale,-.29*scale,1.22*scale));cam.location=aim+Vector((2.5*scale,-3.6*scale,.65*scale))*(1-.12*t)
 cam.rotation_mode='QUATERNION';cam.rotation_quaternion=(aim-cam.location).to_track_quat('-Z','Y');key(cam,frame)
for action in bpy.data.actions:
 for fc in action.fcurves:
  for k in fc.keyframe_points:k.interpolation='LINEAR'
# Explicit shot cut rather than interpolation between two camera positions.
for fc in cam.animation_data.action.fcurves:
 for k in fc.keyframe_points:
  if k.co.x==90:k.interpolation='CONSTANT'
# Independent check of evaluated transforms, including half-frame interpolation.
metrics={k:0. for k in metrics};last={};worst=None
for half in range(2,361):
 f=half/2;scene.frame_set(int(f),subframe=f-int(f));bpy.context.view_layer.update()
 for label,(upper,lower,foot,sign) in legs.items():
  ankle=foot.matrix_world.translation.copy();stance=not any(start<f<end for start,end,_ in steps[label])
  if stance and label in last and last[label][1]:metrics['max_stance_slip']=max(metrics['max_stance_slip'],(ankle-last[label][0]).length)
  last[label]=(ankle,stance)
  sole=next(o for o in foot.children if o.name.startswith('sole'))
  bottom=min((sole.matrix_world@Vector(v)).z for v in sole.bound_box)
  metrics['max_ground_penetration']=max(metrics['max_ground_penetration'],max(0,-.05-bottom))
  for ob,length,endpoint in [(upper,.4*scale,lower),(lower,.4*scale,foot)]:
   tip=ob.matrix_world@Vector((0,0,-length))
   error=(tip-endpoint.matrix_world.translation).length
   if error>metrics['max_link_length_error']:metrics['max_link_length_error']=error;worst=(f,ob.name)
 for ob,length,endpoint in [(shoulder,.43,elbow),(elbow,.31,hand)]:
  tip=ob.matrix_world@Vector((0,0,-length))
  error=(tip-endpoint.matrix_world.translation).length
  if error>metrics['max_link_length_error']:metrics['max_link_length_error']=error;worst=(f,ob.name)
 if f>=120:
  palm=hand.matrix_world@Vector((0,-.16,-.035));contact=prop.matrix_world@Vector((0,.08*scale,0))
  metrics['max_grip_error']=max(metrics['max_grip_error'],(palm-contact).length)
metrics.update({'character':a.character,'frames':180,'fps':30,'checks':'evaluated transforms and sole bounds at 359 half-frame samples; no whole-mesh collision test','approved':False})
assert max(metrics[k] for k in ['max_stance_slip','max_ground_penetration','max_grip_error','max_link_length_error'])<.003*scale,metrics
(out/'contact-report.json').write_text(json.dumps(metrics,indent=2)+'\n')
scene.frame_set(1);bpy.ops.wm.save_as_mainfile(filepath=str(out/'motion_study.blend'))
if a.render:
 frames=[int(f) for f in a.frames.split(',')] if a.frames else range(1,181)
 for f in frames:
  scene.frame_set(f);scene.render.filepath=str(out/'frames'/f'{f:04d}.png');bpy.ops.render.render(write_still=True)
print('MOTION_STUDY_COMPLETE',json.dumps(metrics))
