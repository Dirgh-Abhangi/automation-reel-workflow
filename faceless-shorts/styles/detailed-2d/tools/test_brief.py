import copy,json,unittest
from pathlib import Path
from check_brief import check
class BriefTests(unittest.TestCase):
 def setUp(self):self.p=json.loads((Path(__file__).parent.parent/'briefs/example.json').read_text())
 def test_missing_face_is_question(self):
  r=check(self.p);self.assertFalse(r['fields_resolved']);self.assertIn('/characters/1/appearance/face/details',[q['path'] for q in r['questions']]);self.assertFalse(r['errors'])
 def test_resolved_fields(self):
  self.p['characters'][1]['appearance']['face']='Rounded face, gently arched brows, brown eyes, small nose and faint smile lines';self.assertTrue(check(self.p)['fields_resolved'])
 def test_delegation_is_scoped(self):
  self.p['characters'][1]['appearance']['face']='AGENT_CHOICE';r=check(self.p);self.assertTrue(r['questions'])
  self.p['creative_freedom']=['/characters/1/appearance/face'];r=check(self.p);self.assertFalse(r['questions']);self.assertEqual(r['delegated_choices'],self.p['creative_freedom']);self.assertFalse(r['fields_resolved'])
 def test_unknown_cast(self):
  self.p['shots'][0]['cast'].append('C99');self.assertTrue(check(self.p)['errors'])
 def test_missing_action_and_invalid_environment(self):
  del self.p['shots'][0]['action']['contact'];self.p['shots'][1]['environment']={};r=check(self.p);self.assertTrue(r['errors']);self.assertIn('/shots/0/action/contact',[q['path'] for q in r['questions']])
if __name__=='__main__':unittest.main()
