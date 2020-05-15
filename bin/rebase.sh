#!/bin/bash

while getopts ":r:h:b:n:e:" opt; do
  case $opt in
    r) remote="$OPTARG"
    ;;
    h) head="$OPTARG"
    ;;
    b) base="$OPTARG"
    ;;
    n) name="$OPTARG"
    ;;
    e) email="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

repo=${remote##*/}

mkdir tmp || echo "tmp already exists"
cd tmp

git clone $remote

cd $repo

git config user.name $name
git config user.email $email

git fetch --all

git checkout $base && git reset --hard origin/$base
git checkout $head && git reset --hard origin/$head

# First lets make sure we even need to do anything
hash1=$(git show-ref --heads -s $base)
hash2=$(git merge-base $base $head)

if [ "${hash1}" != "${hash2}" ] ; then
  echo "Rebase is required"

  # Do the rebase
  if git rebase $base ; then
      echo "Rebase Succeeded. Force pushing"
      git push -f origin
      exitCode=0
  else
      echo "Rebase Failed. Cleaning up"
      git rebase --abort
      exitCode=2
  fi
else
  exitCode=1
fi

# Explictly end with nothing to do
exit $exitCode
