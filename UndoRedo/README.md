enyo.UndoRedo
=============
Add to Component the ability to undone properties change

----
Informations
============
**enyo.UndoRedo** add to component undo and redo ability.  
This ability work only on published properties.

**enyo.UndoRedo** add an object in your component, named _undoRedo_.  
It add two functions _undo_ and _redo_, if your have function that have those name, **enyo.UndoRedo** will don't work.

**enyo.UndoRedo** modified the setter of the properties that it observe, so if you edit setter after **enyo.UndoRedo**, undo and redo will not work.

Note about object value
=======================
An object can be saved as property value if, and only if, this object implements the **compareTo** method. 
The Object has to implements this method because _Javascript_ uses pointers for objects, so to avoid some trouble (like have a reference to object instead of a new object) **enyo.UndoRedo** make shadowCopy of the object, but, as says before, _Javascript_ uses pointers, so ``object == shadowCopy`` always return ``false``. 
To avoid comparing each object attribute (recursive work <=> lot of time), the **compareTo** method is the nicest and fastest way to get the equality between two objects.