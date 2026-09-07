from rest_framework import serializers
from .models import Cluster, Namespace, App, BackupJob, PeriodicBackup

class ClusterSerializer(serializers.ModelSerializer):
    namespace_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Cluster
        fields = ["id", "name", "address", "token", "namespace_count"]
        extra_kwargs = {
            "token": {"write_only": True}
        }

class NamespaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Namespace
        fields = ["id", "cluster", "name", "status"]
        read_only_fields = ["status"]

class AppSerializer(serializers.ModelSerializer):
    class Meta:
        model = App
        exclude = ["deletion_status"]
        read_only_fields = ["created_at"]

class AppUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = App
        fields = "__all__"
        read_only_fields = ["id", "name", "namespace", "deletion_status", "created_at",]

class BackupSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackupJob
        fields = ["id", "app", "source_path", "status", "error"]
        read_only_fields = ["id", "status", "error"]

class BackupAppListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackupJob
        fields = ["backup_id", "app", "status", "error"]

class PeriodicBackupSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeriodicBackup
        fields = ["app", "source_path", "schedule",]