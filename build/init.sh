cd `dirname $0`
cd ../
npm install
node build/build.js
ln -s -f ../../build/pre-commit.sh .git/hooks/pre-commit
