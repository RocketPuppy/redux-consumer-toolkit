HTML=../docs
SRC=../src
ESLINTCONF=../.eslintrc

.PHONY: all markdown code

all: markdown code

markdown: cleanmarkdown dirsmarkdown
	lit --weave -odir $(HTML) *.lit
	mv $(HTML)/_book/Redux\ Reducer\ Toolkit_contents.html $(HTML)/index.html
	sed -i "s/href=\"/href=\"_book\//" $(HTML)/index.html

code: cleancode dirscode
	lit --tangle -odir $(SRC) *.lit
	find $(SRC) ! -name "*ramda*" ! -name "*utilities*" -name "*.js" -execdir sh -c "echo '// @flow' | cat - {} > {}.f" \;
	find $(SRC) ! -name "*ramda*" ! -name "*utilities*" -name "*.js" -exec mv {}.f {} \;
	prettier --write "$(SRC)/**/*.js"
	eslint --config $(ESLINTCONF) $(SRC)
	flow check

dirsmarkdown:
	mkdir -p $(HTML)
	touch $(HTML)/.nojekyll

dirscode:
	mkdir -p $(SRC)
	mkdir -p $(SRC)/types
	mkdir -p $(SRC)/examples/reselect

cleanmarkdown:
	rm -rf $(HTML)

cleancode:
	rm -rf $(SRC)
