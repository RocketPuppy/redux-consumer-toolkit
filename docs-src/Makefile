HTML=../docs
SRC=../src_
ESLINTCONF=../.eslintrc

.PHONY: all markdown code

all: markdown code

markdown: cleanmarkdown dirsmarkdown
	lit --weave -odir $(HTML) *.lit
	lit --weave -odir $(HTML) */*.lit

code: cleancode dirscode
	lit --tangle -odir $(SRC) *.lit
	lit --tangle -odir $(SRC) */*.lit
	find $(SRC) -name "*.js" -execdir sh -c "echo '// @flow' | cat - {} > {}.f" \;
	find $(SRC) -name "*.js" -exec mv {}.f {} \;
	prettier --write "$(SRC)/**/*.js"
	eslint --config $(ESLINTCONF) $(SRC)
	flow check

dirsmarkdown:
	mkdir -p $(HTML)
	touch $(HTML)/.nojekyll

dirscode:
	mkdir -p $(SRC)
	mkdir -p $(SRC)/types

cleanmarkdown:
	rm -rf $(HTML)

cleancode:
	rm -rf $(SRC)
