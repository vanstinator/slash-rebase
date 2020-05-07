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

# First lets make sure we even need to do anything
hash1=$(git show-ref --heads -s $base)
hash2=$(git merge-base $base $head)
[ "${hash1}" = "${hash2}" ] && exit 1 || echo "Rebase is required"

git checkout $base
# Checkout and pull head
git checkout $head

# Do the rebase
if git rebase $base ; then
    echo "Rebase Succeeded. Force pushing"
    git push -f origin
    exit 0
else
    echo "Rebase Failed. Cleaning up"
    git rebase --abort
fi

# Clean up
cd ..
rm -r $repo

# Explictly end with nothing to do
exit 2
