#!/bin/bash

while getopts ":u:h:b:" opt; do
  case $opt in
    u) url="$OPTARG"
    ;;
    h) head="$OPTARG"
    ;;
    b) base="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

repo=${url##*/}

mkdir /tmp || echo "tmp already exists"
cd /tmp

git clone $url

cd $repo

git fetch

# First lets make sure we even need to do anything
hash1=$(git show-ref --heads -s $base)
hash2=$(git merge-base $base $head)
[ "${hash1}" = "${hash2}" ] && exit 1 || echo "Rebase is required"

# Checkout and pull latest base changes
git checkout $base && git pull --rebase=true

# Checkout and pull head
git checkout $head && git pull --rebase=true

# Do the rebase
if git rebase $base ; then
    echo "Rebase Succeeded. Force pushing"
    git push -f origin
    exit 0
else
    echo "Rebase Failed. Cleaning up"
    git rebase --abort
fi

exit 2
