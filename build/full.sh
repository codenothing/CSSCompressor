#!/bin/bash
cd `dirname $0`
cd ../
SRCROOT=${PWD}

# Clean out and rebuild before running through each enviorment
make clean
make build

echo "===== NVM DIR::: $NVM_DIR ===="

# Find each availiable node version and test with that version
for i in $( ls $NVM_DIR )
do
	if [[ $i =~ ^v ]]; then
		echo ""
		echo ""
		echo "=== Node $i ==="
		echo ""

		# Run test suite
		"$NVM_DIR/$i/bin/node" "$SRCROOT/build/test.js"
	fi
done
