from django.apps import AppConfig

#trigger event -> add_counter
def add_counter(User, amount):
    return 0;


class RewardsConfig(AppConfig):
    name = 'rewards'
