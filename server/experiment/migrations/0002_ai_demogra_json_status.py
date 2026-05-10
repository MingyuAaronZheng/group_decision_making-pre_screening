from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiment', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='aidemograsurvey',
            name='ai_mental_capacity_responses',
            field=models.JSONField(default=list),
        ),
    ]
