#!/bin/bash
cd `dirname $0`
cd ../
SRCROOT=${PWD}
NEXIT_CODE=0

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

		# Any non successful exit should be treated as full error
		RESULT=$?
		if [[ $RESULT != 0 ]]; then
			NEXIT_CODE=1
		fi
	fi
done

exit $NEXIT_CODE
