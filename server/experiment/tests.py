import json

from django.test import Client, TestCase

from experiment.models import AIDemograSurvey, Subject


class PreScreeningProtocolTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_create_subject_requires_prolific_identity(self):
        response = self.client.post('/ccw/api/create_subject', {})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['status'], 'invalid_prolific_identity')
        self.assertEqual(Subject.objects.count(), 0)

    def test_create_subject_starts_in_progress_until_ai_survey(self):
        response = self.client.post('/ccw/api/create_subject', {
            'worker_id': 'worker-1',
            'study_id': 'study-1',
            'session_id': 'session-1',
            'test': 'Y',
            'test_moderator_code': '0',
            'test_participant_code': '0',
            'test_policy_number': '1',
            'test_turn_number': '4',
        })

        self.assertEqual(response.status_code, 200)
        subject = Subject.objects.get(pk=response.json()['subject_id'])
        self.assertEqual(subject.status, 'in progress')
        self.assertEqual(AIDemograSurvey.objects.count(), 0)

    def test_valid_ai_survey_marks_subject_eligible(self):
        create_response = self.client.post('/ccw/api/create_subject', {
            'worker_id': 'worker-2',
            'study_id': 'study-1',
            'session_id': 'session-2',
        })
        subject_id = create_response.json()['subject_id']

        response = self.client.post('/ccw/api/updateAIDemograSurvey', {
            'subject_id': str(subject_id),
            'aiToolUsageFrequency': '4',
            'aiAttitudeSelection': '5',
            'aiInMusic': '2',
            'aiInEmail': '3',
            'aiInHomeDevices': '2',
            'aiMentalCapacityResponses': json.dumps(['1', '2', '3', '4', '5', '6']),
        })

        self.assertEqual(response.status_code, 200)
        subject = Subject.objects.get(pk=subject_id)
        self.assertEqual(subject.status, 'eligible_for_main_recruitment')
