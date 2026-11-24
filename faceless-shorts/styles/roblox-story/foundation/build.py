"""Blender proof asset generator. blender -b --python build.py -- --out DIR [--render]"""
import bpy,math,sys,argparse,json
from pathlib import Path
from mathutils import Vector
p=argparse.ArgumentParser();p.add_argument('--out',required=True);p.add_argument('--render',action='store_true');p.add_argument('--frame',type=int,default=1);a=p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
out=Path(a.out).resolve();out.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def mat(name,col,rough=.55,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*col,1);m.use_nodes=True;s=m.node_tree.nodes.get('Principled BSDF');s.inputs['Base Color'].default_value=(*col,1);s.inputs['Roughness'].default_value=rough;s.inputs['Metallic'].default_value=metal;return m
def cube(name,loc,size,m,parent=None,bevel=.035):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 if bevel:b=o.modifiers.new('soft manufactured edges','BEVEL');b.width=bevel;b.segments=3;o.modifiers.new('weighted normals','WEIGHTED_NORMAL')
 if parent:o.parent=parent
 return o
def ball(name,loc,scale,m,parent=None):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,location=loc);o=bpy.context.object;o.name=name;o.scale=scale;o.data.materials.append(m)
 for poly in o.data.polygons:poly.use_smooth=True
 if parent:o.parent=parent
 return o
def joint(name,loc,parent=None):
 o=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(o);o.location=loc;o.parent=parent;return o
def text(name,body,loc,size,m,rot=(math.pi/2,0,0),parent=None):
 bpy.ops.object.text_add(location=loc,rotation=rot);o=bpy.context.object;o.name=name;o.data.body=body;o.data.align_x='CENTER';o.data.size=size;o.data.extrude=.001;o.data.materials.append(m);o.parent=parent;return o
skin=mat('warm skin',(.61,.34,.18));black=mat('ink',(.012,.016,.022));white=mat('warm ivory',(.85,.83,.75));gold=mat('brushed brass',(.6,.35,.09),.25,.7)
profiles=json.loads((Path(__file__).parent/'characters.json').read_text())
for idx,c in enumerate(profiles):
 root=joint(c['id'],((idx-(len(profiles)-1)/2)*1.85,0,-.05-.0025*c['scale']));root.scale=(c['scale'],)*3
 cloth=mat(c['id']+' cloth',tuple(c['shirt']));hair=mat(c['id']+' hair',tuple(c['hair']),.32);s=mat(c['id']+' skin',tuple(c['skin']))
 # Pivots use local coordinates, compatible semantic names across every family.
 hips=joint(c['id']+'/hips',(0,0,.83),root);torso=joint(c['id']+'/torso',(0,0,0),hips)
 cube('jacket',(0,0,.36),(.72,.4,.78),cloth,torso,.025)
 cube('shirt insert',(0,-.213,.47),(.18,.025,.53),white,torso,.01)
 for side in [-1,1]:
  lap=cube('lapel',(side*.16,-.238,.55),(.13,.035,.35),cloth,torso,.015);lap.rotation_euler.y=side*.35
  cube('pocket',(side*.23,-.215,.16),(.15,.025,.12),cloth,torso,.01)
 for z in [.22,.37,.52]:ball('button',(.02,-.25,z),(.022,.016,.022),gold,torso)
 head=joint(c['id']+'/head',(0,0,.82),torso)
 if c['id']=='child': head.scale=(1.18,)*3
 if c['id']=='older': torso.rotation_euler.x=.06
 cube('rounded head',(0,0,.24),(.59,.49,.53),s,head,.075)
 for side in [-1,1]:
  ball('ear',(side*.3,0,.23),(.06,.07,.09),s,head)
  eye=ball('eye',(side*.105,-.25,.27),(.036,.012,.058),black,head)
  for fr,fac in [(1,1),(30,1),(36,1.45),(52,1.45),(60,.7),(72,.7),(82,1),(90,1)]:
   eye.scale.z=.058*fac;eye.keyframe_insert('scale',frame=fr)
  ball('eye highlight',(side*.105-.008,-.269,.286),(.009,.005,.012),white,head)
  brow=cube('brow',(side*.105,-.255,.37),(.09,.018,.021),hair,head,.008);brow.rotation_euler.y=side*-.12
  for fr,angle in [(1,-.12),(30,-.12),(36,.3),(52,.3),(60,-.5),(72,-.5),(82,-.12),(90,-.12)]:
   brow.rotation_euler.y=side*angle;brow.keyframe_insert('rotation_euler',frame=fr)
 # Curved smile made from a bevelled curve, same placement for all identities.
 curve=bpy.data.curves.new('smile','CURVE');curve.dimensions='3D';curve.bevel_depth=.012;curve.bevel_resolution=3;sp=curve.splines.new('POLY');sp.points.add(12)
 for k,pt in enumerate(sp.points):x=(k/12-.5)*.17;pt.co=(x,-.26,3*x*x,1)
 ob=bpy.data.objects.new('smile',curve);bpy.context.collection.objects.link(ob);ob.parent=head;ob.location.z=.115;ob.data.materials.append(black)
 # Reusable mouth transition: neutral -> surprise -> tense -> neutral.
 opening=ball('open mouth',(0,-.262,.115),(.055,.009,.072),black,head)
 for fr,amount in [(1,.001),(30,.001),(36,1),(52,1),(60,.001),(72,.001),(82,.001),(90,.001)]:
  opening.scale=(.055*amount,.009,.072*amount);opening.keyframe_insert('scale',frame=fr)
  ob.scale=(1-amount*.999,1,-1 if fr in [60,72] else 1-amount*.999);ob.keyframe_insert('scale',frame=fr)
 # Tapered swept hair clumps rather than spherical beads.
 def hairlock(name,x,z,width,length,drop):
  verts=[];faces=[]
  for row in range(9):
   u=row/8;cy=.18-u*.46;cx=x+math.sin(u*math.pi)*.06;cz=z+.08*math.sin(u*math.pi)-drop*u*u
   radius=width*(.45+.55*math.sin(math.pi*(u*.85+.08)))
   if row==8:radius=.004
   for k in range(8):
    ang=k*math.pi/4;verts.append((cx+math.cos(ang)*radius,cy,cz+math.sin(ang)*radius*.65))
  for row in range(8):
   for k in range(8):faces.append((row*8+k,row*8+(k+1)%8,(row+1)*8+(k+1)%8,(row+1)*8+k))
  faces.extend([tuple(range(7,-1,-1)),tuple(range(64,72))]);mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);o.parent=head;o.data.materials.append(hair)
  for poly in mesh.polygons:poly.use_smooth=True

 for k in range(7):
  hairlock('swept hair', (k-3)*.083,.51+(.035 if k<3 else 0),.065,.46,.07+abs(k-3)*.012)
 if c['long_hair']:
  for side in [-1,1]:
   for k in range(3):cube('layered side hair',(side*(.27+k*.009),.07,.28-k*.13),(.09,.29,.31),hair,head,.035)
 if c['glasses']:
  for side in [-1,1]:
   for z in [.21,.33]:cube('glasses rim',(side*.108,-.278,z),(.19,.018,.014),gold,head,.004)
   for x in [side*.108-.09,side*.108+.09]:cube('glasses rim',(x,-.278,.27),(.014,.018,.12),gold,head,.004)
  cube('glasses bridge',(0,-.28,.28),(.04,.02,.012),gold,head,.004)
 for side,label in [(-1,'L'),(1,'R')]:
  shoulder=joint(c['id']+'/shoulder_'+label,(side*.49,0,.7),torso)
  cube('sleeve',(0,0,-.22),(.25,.35,.43),cloth,shoulder,.025)
  elbow=joint(c['id']+'/elbow_'+label,(0,0,-.43),shoulder);cube('forearm',(0,0,-.15),(.23,.31,.3),s,elbow,.025)
  hand=joint(c['id']+'/hand_'+label,(0,0,-.31),elbow);cube('hand',(0,-.01,-.035),(.24,.3,.13),s,hand,.04)
  leg=joint(c['id']+'/leg_'+label,(side*.19,0,0),hips);cube('trouser',(0,0,-.35),(.31,.35,.7),black,leg,.035);cube('shoe',(0,-.065,-.73),(.34,.49,.15),black,leg,.04);cube('sole',(0,-.065,-.81),(.35,.5,.035),white,leg,.008)
  # Wave study: anticipation -> lift -> wrist/arm oscillation -> return.
  if label=='R':
   for frame,angle in [(1,0),(12,-.12),(28,1.9),(40,2.15),(52,1.8),(64,2.1),(78,0),(90,0)]:shoulder.rotation_euler.y=-angle;shoulder.keyframe_insert('rotation_euler',frame=frame)
  for frame,angle in [(1,0),(24,.06),(42,-.08),(64,.04),(90,0)]:head.rotation_euler.z=angle;head.keyframe_insert('rotation_euler',frame=frame)
 text('name',c['label'],(0,-.65,.012),.1,white,rot=(0,0,0),parent=root)
wood=mat('walnut',(.16,.075,.035));wall=mat('paint',(.19,.25,.26));floor=mat('oak',(.33,.19,.09));glass=mat('window blue',(.12,.28,.36),.18)
for i in range(18):cube('floorboard',(i*.45-4,1,-.13),(.44,7,.16),floor,bevel=.009)
cube('back wall',(0,3,1.8),(9,.16,4),wall)
for x in [-3,0,3]:
 cube('window',(x,2.89,2.1),(1.6,.05,1.8),glass)
 for dx in [-.86,0,.86]:cube('window frame',(x+dx,2.8,2.1),(.06,.12,1.95),wood,.0 if False else None)
 for z in [1.15,2.1,3.05]:cube('window frame',(x,2.8,z),(1.8,.12,.06),wood)
for x in [-3.4,3.4]:
 cube('bookcase backing',(x,2,1.1),(1,.12,2.2),wood)
 for z in [.15,.7,1.25,1.8,2.25]:cube('shelf',(x,1.8,z),(1,.55,.07),wood)
 for row in range(4):
  for k in range(7):cube('book',(x-.39+k*.12,1.75,.4+row*.55),(.09,.28,.38),mat(f'book{row}{k}',[(.3,.1,.07),(.08,.2,.21),(.45,.32,.11)][k%3]),bevel=.006)
cube('console',(0,2,.7),(2.7,.65,.13),wood)
for x in [-1.15,1.15]:cube('console leg',(x,2,.3),(.08,.5,.7),gold)
text('room sign','CHARACTER STUDIES',(0,2.78,3.45),.24,gold)
def area(name,loc,power,size,color,target):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.data.color=color;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
area('large warm key',(-3,-4,6),900,5,(1,.78,.58),(0,0,1));area('cool fill',(4,-1,4),600,4,(.58,.78,1),(0,0,1));area('rim',(0,3,4),1000,3,(1,.65,.3),(0,0,1))
bpy.ops.object.camera_add(location=(4,-9,4));cam=bpy.context.object;cam.rotation_euler=(Vector((0,.6,1.15))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=8.5;bpy.context.scene.camera=cam
scene=bpy.context.scene;scene.frame_end=90;scene.render.fps=30;scene.frame_set(a.frame);scene.render.engine='CYCLES';scene.cycles.samples=64;scene.cycles.use_denoising=False;scene.render.resolution_x=1280;scene.render.resolution_y=900;scene.render.resolution_percentage=75
scene.world.color=(.16,.16,.16)
bpy.ops.wm.save_as_mainfile(filepath=str(out/'character_lab.blend'))
bpy.ops.export_scene.gltf(filepath=str(out/'character_lab.glb'),export_format='GLB',export_animations=True,export_animation_mode='SCENE',export_anim_scene_split_object=False,export_apply=True,export_cameras=True,export_lights=True)
if a.render:scene.render.filepath=str(out/'character_lab.png');bpy.ops.render.render(write_still=True)
print('FOUNDATION_BUILD_COMPLETE')
