from distutils.core import setup
from setuptools import find_packages

setup(
    name='django-webcam-photoupload',
    version='0.3.3',
    author='Mike Vattuone',
    author_email='mike.v@engagementlab.org',
    url='https://github.com/citizenengagementlab/django-webcam-photoupload',
    license='LICENSE.txt',
    description='Webcam photo uploads for the movement',
    long_description=open('README.txt').read(),
    install_requires=[
        "Django == 1.5",
    ],
    packages=find_packages(),
    include_package_data=True,
)