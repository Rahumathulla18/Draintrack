import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Calendar,
  ExternalLink,
  Map as MapIcon,
  X,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { DrainageLocation, DrainageCondition } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { DrainageMap } from '../common/DrainageMap';
import { initialWorkers } from '../../data/mockData';

interface DrainageLocationsPageProps {
  drainages: DrainageLocation[];
  onAddDrainage: (drainage: Omit<DrainageLocation, 'drainage_id'>) => void;
  onUpdateCondition?: (id: string, condition: DrainageCondition) => void;
}

export const DrainageLocationsPage: React.FC<DrainageLocationsPageProps> = ({
  drainages = [],
  onAddDrainage,
  onUpdateCondition
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMapDrainage, setSelectedMapDrainage] = useState<DrainageLocation | null>(null);

  // New drainage location form fields
  const [locationName, setLocationName] = useState('');
  const [talukName, setTalukName] = useState('Bengaluru East');
  const [wardName, setWardName] = useState('Indiranagar');
  const [zoneId, setZoneId] = useState('zone-a');
  const [latitude, setLatitude] = useState('12.9750');
  const [longitude, setLongitude] = useState('77.6400');
  const [condition, setCondition] = useState<DrainageCondition>('Dirty');
  const [lengthMeters, setLengthMeters] = useState('320');
  const [depthMeters, setDepthMeters] = useState('1.8');
  const [currentStatus, setCurrentStatus] = useState('Accumulated debris and dry leaves');

  const filteredDrainages = drainages.filter((d) => {
    const matchSearch =
      d.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.drainage_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.ward_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCondition = conditionFilter === 'ALL' || d.condition === conditionFilter;
    return matchSearch && matchCondition;
  });

  const handleCreateDrainage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim()) return;

    onAddDrainage({
      location_name: locationName,
      taluk_name: talukName,
      ward_name: wardName,
      zone_id: zoneId,
      latitude: parseFloat(latitude) || 12.975,
      longitude: parseFloat(longitude) || 77.64,
      condition,
      last_cleaned: '2026-09-01',
      current_status: currentStatus || 'Registered via Municipal Drainage GIS',
      length_meters: parseFloat(lengthMeters) || 300,
      depth_meters: parseFloat(depthMeters) || 2.0
    });

    setIsAddModalOpen(false);
    setLocationName('');
  };

  return (
    <div id="admin-drainages-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>Drainage Network Assets &amp; Locations</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            GIS register of storm water drain arterial conduits, condition profiles, and desilting records
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Drainage Location</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by drainage ID, street location, ward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">All Conditions</option>
            <option value="Good">Good (Clean)</option>
            <option value="Moderate">Moderate</option>
            <option value="Dirty">Dirty</option>
            <option value="Blocked">Blocked</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Drainages Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Drainage ID</th>
                <th className="py-3 px-4">Location Name</th>
                <th className="py-3 px-4">Taluk</th>
                <th className="py-3 px-4">Ward</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Coordinates</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Last Cleaned</th>
                <th className="py-3 px-4 text-right">Map View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrainages.map((d) => (
                <tr key={d.drainage_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{d.drainage_id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 max-w-[220px]">
                    <div>{d.location_name}</div>
                    <div className="text-[11px] font-normal text-slate-400">
                      Length: {d.length_meters}m &bull; Depth: {d.depth_meters}m
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{d.taluk_name}</td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-medium">{d.ward_name}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700 uppercase whitespace-nowrap">
                    {d.zone_id.replace('zone-', 'Zone ')}
                  </td>
                  <td className="py-3 px-4 text-[11px] font-mono text-slate-500 whitespace-nowrap">
                    {d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={d.condition} type="condition" size="sm" />
                  </td>
                  <td className="py-3 px-4 max-w-[200px] text-slate-600 truncate">{d.current_status}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{d.last_cleaned}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedMapDrainage(d)}
                      className="px-2.5 py-1 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-semibold text-[11px] inline-flex items-center gap-1"
                    >
                      <MapIcon className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map Preview Modal if clicked */}
      {selectedMapDrainage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{selectedMapDrainage.drainage_id}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedMapDrainage.location_name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedMapDrainage.ward_name} &bull; Lat: {selectedMapDrainage.latitude}, Lng: {selectedMapDrainage.longitude}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMapDrainage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DrainageMap
              drainages={[selectedMapDrainage]}
              workers={initialWorkers}
              height="280px"
              showControls={false}
            />

            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-600 font-medium">
                Current Condition: <StatusBadge status={selectedMapDrainage.condition} type="condition" size="sm" />
              </span>
              <span className="text-slate-500">Last Cleaned: {selectedMapDrainage.last_cleaned}</span>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMapDrainage(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Drainage Location Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>Register Drainage Conduit Asset</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDrainage} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Location / Street Cross Name</label>
                <input
                  type="text"
                  placeholder="e.g. 12th Main Road Culvert #8"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Taluk</label>
                  <select
                    value={talukName}
                    onChange={(e) => setTalukName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="Bengaluru East">Bengaluru East</option>
                    <option value="Bengaluru South">Bengaluru South</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Ward Name</label>
                  <select
                    value={wardName}
                    onChange={(e) => setWardName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="Indiranagar">Indiranagar (112)</option>
                    <option value="Halasuru">Halasuru (113)</option>
                    <option value="Koramangala">Koramangala (147)</option>
                    <option value="BTM Layout">BTM Layout (152)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Zone Code</label>
                  <select
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="zone-a">Zone A</option>
                    <option value="zone-b">Zone B</option>
                    <option value="zone-c">Zone C</option>
                    <option value="zone-d">Zone D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Initial Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as DrainageCondition)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="Good">Good (Clean)</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Dirty">Dirty</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Latitude</label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Longitude</label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Length (meters)</label>
                  <input
                    type="number"
                    value={lengthMeters}
                    onChange={(e) => setLengthMeters(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Depth (meters)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={depthMeters}
                    onChange={(e) => setDepthMeters(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Current Status Notes</label>
                <textarea
                  rows={2}
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Save Drainage Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
