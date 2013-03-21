cd `dirname $0`
cd ../
npm install
ln -s -f ../../build/pre-commit.sh .git/hooks/pre-commit
