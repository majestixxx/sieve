/* 
 * The contents of this file is licenced. You may obtain a copy of
 * the license at http://sieve.mozdev.org or request it via email 
 * from the author. Do not remove or change this comment. 
 * 
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 */
 
 "use strict";
 
// setflag <variablename: string> <list-of-flags: string-list>


function SieveSetFlag(docshell,id) 
{
  SieveAbstractElement.call(this,docshell,id); 
  
  this.whiteSpace = this._createByName("whitespace"," ");
  this.flaglist = this._createByName("stringlist");
  this.semicolon = this._createByName("atom/semicolon");
}

SieveSetFlag.prototype.__proto__ = SieveAbstractElement.prototype;

SieveSetFlag.isElement
    = function (token)
{
  return (token.substring(0,7).toLowerCase().indexOf("setflag") == 0);
}
    
SieveSetFlag.prototype.init
    = function (data)
{  
  data = data.slice("setflag".length);
  
  // ... eat the deadcode before the string...
  data = this.whiteSpace.init(data);
      
  data = this.flaglist.init(data)

  data = this.semicolon.init(data);
    
  return data;
}

SieveSetFlag.prototype.require
    = function (requires)
{
  requires["imap4flags"] = true;
}

SieveSetFlag.prototype.toScript
    = function ()
{
  return "setflag"
    + this.whiteSpace.toScript()
    + this.flaglist.toScript()
    + this.semicolon.toScript();
}

SieveSetFlag.prototype.toWidget
    = function ()
{
  return (new SieveSetFlagUI(this));  
}

/******************************************************************************/

//addflag <variablename: string> <list-of-flags: string-list>

function SieveAddFlag(docshell,id) 
{
  SieveAbstractElement.call(this,docshell,id); 
  
  this.whiteSpace = [];
  this.whiteSpace[0] = this._createByName("whitespace"," ");
  this.whiteSpace[1] = this._createByName("whitespace");  
                
  this.flaglist =  this._createByName("stringlist");
  
  this.semicolon = this._createByName("atom/semicolon");
}

SieveAddFlag.prototype.__proto__ = SieveAbstractElement.prototype;

SieveAddFlag.isElement
    = function (token)
{
  return (token.substring(0,7).toLowerCase().indexOf("addflag") == 0)
}

SieveAddFlag.prototype.init
    = function (data)
{
  // Syntax :
  // <"fileinto"> <string> <";">
  
  data = data.slice("addflag".length);
  
  // ... eat the deadcode before the string...
  data = this.whiteSpace[0].init(data);
  
  data = this.flaglist.init(data)

  data = this.whiteSpace[1].init(data);
    
  data = this.semicolon.init(data);
    
  return data;
}

SieveAddFlag.prototype.require
    = function (requires)
{
  requires["imap4flags"] = true;
}

SieveAddFlag.prototype.toScript
    = function ()
{
  return "addflag"
    + this.whiteSpace[0].toScript()
    + this.flaglist.toScript()
    + this.whiteSpace[1].toScript()        
    + this.semicolon.toScript();
}

SieveAddFlag.prototype.toWidget
    = function ()
{
  return (new SieveAddFlagUI(this));  
}

/******************************************************************************/

//removeflag <variablename: string> <list-of-flags: string-list>



function SieveRemoveFlag(docshell,id) 
{
  SieveAbstractElement.call(this,docshell,id); 
  
  this.whiteSpace = [];
  this.whiteSpace[0] = this._createByName("whitespace", " ");
  this.whiteSpace[1] = this._createByName("whitespace");  
                
  this.flaglist =  this._createByName("stringlist");
  
  this.semicolon = this._createByName("atom/semicolon");
}

SieveRemoveFlag.prototype.__proto__ = SieveAbstractElement.prototype;

SieveRemoveFlag.isElement
  = function(token)
{ 
 if (token.indexOf("removeflag") == 0)
    return true;
 
 return false;
}

SieveRemoveFlag.prototype.init
    = function (data)
{
  // Syntax :
  // <"fileinto"> <string> <";">
  
  data = data.slice("removeflag".length);
  
  // ... eat the deadcode before the string...
  data = this.whiteSpace[0].init(data);
      
  data = this.flaglist.init(data)

  data = this.whiteSpace[1].init(data);
    
  // ... and finally remove the semicolon;
  data = this.semicolon.init(data);
    
  return data;
}

SieveRemoveFlag.prototype.require
    = function (requires)
{
  requires["imap4flags"] = true;
}

SieveRemoveFlag.prototype.toScript
    = function ()
{
  return "removeflag"
    + this.whiteSpace[0].toScript()
    + this.flaglist.toScript()
    + this.whiteSpace[1].toScript()        
    + this.semicolon.toScript();
}

SieveRemoveFlag.prototype.toWidget
    = function ()
{
  return (new SieveRemoveFlagUI(this));  
}

/******************************************************************************/

//hasflag [MATCH-TYPE] <variable-list: string-list> <list-of-flags: string-list>

// REGISTER


 
function SieveHasFlag(docshell,id)
{
  SieveAbstractElement.call(this,docshell,id); 

  this.whiteSpace = [];
  this.whiteSpace[0] = this._createByName("whitespace", " ");
  this.whiteSpace[1] = this._createByName("whitespace", " ");
  this.whiteSpace[2] = this._createByName("whitespace", " ");    

  this.matchType      = null;
  this.flagList = this._createByName("stringlist");
}

SieveHasFlag.prototype.__proto__ = SieveAbstractElement.prototype;

SieveHasFlag.isElement
  = function(token)
{ 
 if (token.indexOf("hasflag") == 0)
    return true;
 
 return false;
}

SieveHasFlag.prototype.init
    = function (data)
{
  data = data.slice("hasflag".length);
  
  data = this.whiteSpace[0].init(data)
  
  
  if (this._probeByName("match-type",data))
  {
    this.matchType = this._createByName("match-type");
    data = this.matchType.init(data);
    
    data = this.whiteSpace[1].init(data);
  }
  
  data = this.flagList.init(data);
  data = this.whiteSpace[2].init(data);
      
  return data;
}    

SieveHasFlag.prototype.require
    = function (requires)
{
  requires["imap4flags"] = true;
}

SieveHasFlag.prototype.toScript
    = function ()
{
  return "hasflag"
    + this.whiteSpace[0].toScript()
    + ((this.matchType != null)?this.matchType[0].toScript():"")
    + ((this.matchType != null)?this.whiteSpace[1].toScript():"")
    + this.flagList.toScript()
    + this.whiteSpace[2].toScript();
}

SieveHasFlag.prototype.toWidget
    = function ()
{
  return (new SieveHasFlagUI(this));  
}

/******************************************************************************/

if (!SieveLexer)
  throw "Could not register IMAP Flags";

SieveLexer.register("action","action/addflag",SieveAddFlag);
      
SieveLexer.register("action","action/removeflag",SieveRemoveFlag);  
      
SieveLexer.register("action","action/setflag",SieveSetFlag);
      
SieveLexer.register("test","test/hasflag",SieveHasFlag);
 