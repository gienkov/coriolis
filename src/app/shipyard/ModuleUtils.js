import { ModuleNameToGroup, BulkheadNames, StandardArray } from './Constants';
import ModuleSet from './ModuleSet';
import { Ships, Modules } from 'coriolis-data/dist';



/**
 * Created a cargo hatch model
 * @return {Object} Cargo hatch model
 */
export function cargoHatch() {
  return { name: 'Cargo Hatch', class: 1, rating: 'H', power: 0.6 };
};

/**
 * Finds the standard module type with the specified ID
 * @param  {String|Number} type   Standard Module Type (0/pp - Power Plant, 1/t - Thrusters, etc)
 * @param  {String} id            The module ID or '[Class][Rating]'
 * @return {Object}               The standard module or null
 */
export function standard(type, id) {
  if (!isNaN(type)) {
    type = StandardArray[type];
  }

  let s = Modules.standard[type].find(e => e.id == id || (e.class == id.charAt(0) && e.rating == id.charAt(1)));
  return s || null;
};

/**
 * Finds the hardpoint with the specified ID
 * @param  {String} id Hardpoint ID
 * @return {Object}    Hardpoint module or null
 */
export function hardpoints(id) {
  for (let n in Modules.hardpoints) {
    let group = Modules.hardpoints[n];
    for (let i = 0; i < group.length; i++) {
      if (group[i].id == id) {
        return group[i];
      }
    }
  }
  return null;
};

/**
 * Finds the internal module with the specified ID
 * @param  {String} id Internal module ID
 * @return {Object}    Internal module or null
 */
export function internal(id) {
  for (let n in Modules.internal) {
    let group = Modules.internal[n];
    for (let i = 0; i < group.length; i++) {
      if (group[i].id == id) {
        return group[i];
      }
    }
  }
  return null;
};

/**
 * Finds an internal module based on Class, Rating, Group and/or name.
 * At least one ofGroup name or unique module name must be provided
 *
 * @param  {String} groupName [Optional] Full name or abbreviated name for module group
 * @param  {integer} clss     module Class
 * @param  {String} rating    module Rating
 * @param  {String} name      [Optional] Long/unique name for module -e.g. 'Advanced Discover Scanner'
 * @return {Object}           The module if found, null if not found
 */
export function findInternal(groupName, clss, rating, name) {
  let groups = {};

  if (groupName) {
    if (Modules.internal[groupName]) {
      groups[groupName] = Modules.internal[groupName];
    } else {
      let grpCode = ModuleNameToGroup[groupName.toLowerCase()];
      if (grpCode && Modules.internal[grpCode]) {
        groups[grpCode] = Modules.internal[grpCode];
      }
    }
  } else if (name) {
    groups = Modules.internal;
  }

  for (let g in groups) {
    let group = groups[g];
    for (let i = 0, l = group.length; i < l; i++) {
      if (group[i].class == clss && group[i].rating == rating && ((!name && !group[i].name) || group[i].name == name)) {
        return group[i];
      }
    }
  }

  return null;
}

/**
 * Finds an internal Module ID based on Class, Rating, Group and/or name.
 * At least one ofGroup name or unique module name must be provided
 *
 * @param  {String} groupName [Optional] Full name or abbreviated name for module group
 * @param  {integer} clss     module Class
 * @param  {String} rating    Module Rating
 * @param  {String} name      [Optional] Long/unique name for module -e.g. 'Advanced Discover Scanner'
 * @return {String}           The id of the module if found, null if not found
 */
export function findInternalId(groupName, clss, rating, name) {
  let i = this.findInternal(groupName, clss, rating, name);
  return i ? i.id : 0;
}

/**
 * Finds a hardpoint Module based on Class, Rating, Group and/or name.
 * At least one ofGroup name or unique module name must be provided
 *
 * @param  {String} groupName [Optional] Full name or abbreviated name for module group
 * @param  {integer} clss     Module Class
 * @param  {String} rating    [Optional] module Rating
 * @param  {String} name      [Optional] Long/unique name for module -e.g. 'Heat Sink Launcher'
 * @param  {String} mount     Mount type - [F]ixed, [G]imballed, [T]urret
 * @param  {String} missile   [Optional] Missile type - [D]umbfire, [S]eeker
 * @return {String}           The id of the module if found, null if not found
 */
export function findHardpoint(groupName, clss, rating, name, mount, missile) {
  let groups = {};

  if (groupName) {
    if (Modules.hardpoints[groupName]) {
      groups[groupName] = Modules.hardpoints[groupName];
    } else {
      let grpCode = ModuleNameToGroup[groupName.toLowerCase()];
      if (grpCode && Modules.hardpoints[grpCode]) {
        groups[grpCode] = Modules.hardpoints[grpCode];
      }
    }
  } else if (name) {
    groups = Modules.hardpoints;
  }

  for (let g in groups) {
    let group = groups[g];
    for (let h of group) {
      if (h.class == clss && (!rating || h.rating == rating) && h.mount == mount && h.name == name && h.missile == missile) {
        return h;
      }
    }
  }

  return null;
}

/**
 * Finds a hardpoint module ID based on Class, Rating, Group and/or name.
 * At least one of Group name or unique module name must be provided
 *
 * @param  {String} groupName [Optional] Full name or abbreviated name for module group
 * @param  {integer} clss     module Class
 * @param  {String} rating    module Rating
 * @param  {String} name      [Optional] Long/unique name for module -e.g. 'Heat Sink Launcher'
 * @param  {String} mount     Mount type - [F]ixed, [G]imballed, [T]urret
 * @param  {String} missile   [Optional] Missile type - [D]umbfire, [S]eeker
 * @return {String}           The id of the module if found, null if not found
 */
export function findHardpointId(groupName, clss, rating, name, mount, missile) {
  let h = this.findHardpoint(groupName, clss, rating, name, mount, missile);
  return h ? h.id : 0;
}

/**
 * Get the bulkhead index for the given bulkhead name
 * @param  {String} bulkheadName Bulkhead name in english
 * @return {number}              Bulkhead index
 */
export function bulkheadIndex(bulkheadName) {
  return BulkheadNames.indexOf(bulkheadName);
}


/**
 * Determine if a module group is a shield generator
 * @param  {String}  g Module Group name
 * @return {Boolean}   True if the group is a shield generator
 */
export function isShieldGenerator(g) {
  return g == 'sg' || g == 'psg' || g == 'bsg';
}

/**
 * Creates a new ModuleSet that contains all available modules
 * that the specified ship is eligible to use.
 *
 * 6.5 T is the lightest possible mass of standard components that any ship can use
 *
 * @param  {String} shipId    Unique ship Id/Key
 * @return {ModuleSet}     The set of modules the ship can install
 */
export function forShip(shipId) {
  return new ModuleSet(Modules, Ships[shipId]);
}
