#!/usr/bin/env python

import json 
import os, sys



PATH = "./"       # assume script is called from the data dir, as    ./scripts/mk_ccss_data.py

if not os.path.exists(PATH+"sources"):
    PATH = "../"       # maybe called as ./mk_ccss_data.py  ??
    
    if not os.path.exists(PATH+"sources"):
        print "Error data sources dit noth found..."
        exit(-1)


ccss_data = json.load( open(PATH+"sources/standards-data/clean-data/CC/math/CC-math-0.8.0.json") )

# one off helpers
def show_fields(idx):
    for k,v in ccss[idx].iteritems(): 
        print (k+":").ljust(20), v

def filterbyvalue(seq, attr, value):
   for el in seq:
      if el.get(attr, None)==value: 
        yield el


def export_for_bookmarklet( data ):
    """
    Export shortCode and statement of each CC item.
    """
    inlist = data
    outlist = []

    for item in inlist:
        if not item.get("shortCode", None):
            continue
        if item.get("cls", None)=="folder":               # skip folder-like things
            continue
        d = {}

        shortCode = ""
        if item["gradeLevel"] == "High School":
            shortCode = "HS." + item["shortCode"]
        else:
            shortCode = item["shortCode"]

        d["shortCode"] = shortCode
        d["statement"] = item["statement"]
        outlist.append( d )
      
    return outlist


def write_json( data ):
    """Write out the outlist to a file (to read from js) """

    with open( PATH + 'ccss_data.json', 'w') as outfile:
        json.dump(data, outfile, indent=2)

    print "Wrote data to file  ", PATH + "ccss_data.json"



def main():
    print "Starting..."
    leafs = export_for_bookmarklet( ccss_data )
    write_json( leafs )

    

if __name__== "__main__":
    main()

