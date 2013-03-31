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

		# Prepend tests ran with node version run in
		cd "$SRCROOT/build/results"
		for xml in *.xml
		do
			if [[ ! $xml =~ ^v ]]; then
				v=${i//\./_}

				sed "s/classname=\'/classname=\'$v\./g" "$xml" > "$SRCROOT/build/results/tmp.$xml"
				sed "s/<testsuite name=\'/<testsuite name=\'$v\./g" "$SRCROOT/build/results/tmp.$xml" > "$SRCROOT/build/results/$v.$xml"
				rm "$xml"
				rm "$SRCROOT/build/results/tmp.$xml"
			fi
		done
	fi
done
